import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";

// Add comment to a Post or a Tweet (Supports nested replies)
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params; // Can be postId or tweetId
    const { content, parentComment, replyToUser } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Target Post/Tweet ID is invalid");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment cannot be empty!");
    }

    // Check if target is a Post or a Tweet
    const post = await Post.findById(postId);
    let tweet = null;
    if (!post) {
        tweet = await Tweet.findById(postId);
    }

    if (!post && !tweet) {
        throw new ApiError(404, "Post or Tweet not found");
    }

    const commentData = {
        content: content.trim(),
        owner: req.user._id,
        parentComment: parentComment && mongoose.Types.ObjectId.isValid(parentComment) ? parentComment : null,
        replyToUser: replyToUser && mongoose.Types.ObjectId.isValid(replyToUser) ? replyToUser : null
    };

    if (post) {
        commentData.post = post._id;
    } else {
        commentData.tweet = tweet._id;
    }

    const comment = await Comment.create(commentData);

    if (!comment) {
        throw new ApiError(400, "Failed to store comment!");
    }

    await comment.populate("owner", "username fullName avatar");
    if (comment.replyToUser) {
        await comment.populate("replyToUser", "username fullName avatar");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    );
});

// Delete comment and all its cascading replies
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    let post = null;
    let tweet = null;
    if (comment.post) {
        post = await Post.findById(comment.post);
    } else if (comment.tweet) {
        tweet = await Tweet.findById(comment.tweet);
    }

    const isCommentAuthor = comment.owner.toString() === req.user._id.toString();
    const isPostAuthor = post && post.owner.toString() === req.user._id.toString();
    const isTweetAuthor = tweet && tweet.owner.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor && !isTweetAuthor) {
        throw new ApiError(
            403,
            "Unauthorized: Only the creator of the post/tweet or the author of the comment can delete it."
        );
    }

    // Find all cascading replies to this comment
    let commentsToDelete = [commentId.toString()];
    let queue = [commentId.toString()];

    while (queue.length > 0) {
        const parentId = queue.shift();
        const replies = await Comment.find({ parentComment: parentId }).select("_id");
        for (const r of replies) {
            const rId = r._id.toString();
            if (!commentsToDelete.includes(rId)) {
                commentsToDelete.push(rId);
                queue.push(rId);
            }
        }
    }

    await Comment.deleteMany({ _id: { $in: commentsToDelete } });

    // Delete all likes associated with these comments
    await Like.deleteMany({
        comment: { $in: commentsToDelete }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            { commentId, deletedIds: commentsToDelete },
            "Comment and all replies deleted successfully."
        )
    );
});

// Show all comments for a Post or Tweet
const showAllComments = asyncHandler(async (req, res) => {
    const { postId } = req.params; // Can be postId or tweetId

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Target ID is invalid");
    }

    const targetObjId = new mongoose.Types.ObjectId(postId);

    const aggregate = Comment.aggregate([
        {
            $match: {
                $or: [
                    { post: targetObjId },
                    { tweet: targetObjId }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "replyToUser",
                foreignField: "_id",
                as: "replyToUser",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "likedBy",
                            foreignField: "_id",
                            as: "likedBy",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            likedBy: { $first: "$likedBy" }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                replyToUser: {
                    $first: "$replyToUser"
                },
                likesCount: {
                    $size: "$likes"
                },
                isLiked: req.user?._id
                    ? {
                        $in: [
                            new mongoose.Types.ObjectId(req.user._id),
                            "$likes.likedBy"
                        ]
                    }
                    : false
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        }
    ]);

    const selectedComments = await Comment.aggregatePaginate(
        aggregate,
        {
            page,
            limit
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            selectedComments,
            selectedComments.docs.length === 0
                ? "No comments found"
                : "Comments fetched successfully"
        )
    );
});

// Edit comment
const editComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Comment ID is invalid");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content cannot be empty!");
    }

    if (req.user?._id.toString() !== comment.owner.toString()) {
        throw new ApiError(403, "You can only edit your own comments");
    }

    const editedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true
        }
    ).populate("owner", "username fullName avatar");

    if (!editedComment) {
        throw new ApiError(400, "Failed to update comment!");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            editedComment,
            "Comment updated successfully."
        )
    );
});

export {
    addComment,
    deleteComment,
    showAllComments,
    editComment
};