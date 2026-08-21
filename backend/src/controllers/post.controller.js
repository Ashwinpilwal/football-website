import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
    uploadOnCloudinary,
    deleteFromCloudinary
} from "../utils/cloudinary.js";

import { Post } from "../models/post.model.js";
import { Section } from "../models/section.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

const createPost = asyncHandler(async (req, res) => {
    const { caption, section } = req.body;
    const mediaFiles = req.files?.media || [];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // At least one media file
    if (!mediaFiles.length) {
        throw new ApiError(400, "At least one image or video is required!");
    }

    // Check section ownership
    if (section) {
        const sectionExists = await Section.findOne({
            _id: section,
            owner: req.user._id
        });

        if (!sectionExists) {
            throw new ApiError(404, "Section not found or you are not the owner!");
        }
    }

    // Upload media
    const media = [];
    for (const file of mediaFiles) {
        const uploadedFile = await uploadOnCloudinary(file.path);
        if (!uploadedFile) {
            throw new ApiError(400, "Failed to upload media!");
        }

        media.push({
            url: uploadedFile.secure_url,
            public_id: uploadedFile.public_id,
            type: file.mimetype.startsWith("video") ? "video" : "image"
        });
    }

    // Upload optional post thumbnail
    let thumbnail = { url: "", public_id: "" };
    if (thumbnailFile) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path);
        if (!uploadedThumbnail) {
            throw new ApiError(400, "Failed to upload thumbnail!");
        }

        thumbnail = {
            url: uploadedThumbnail.secure_url,
            public_id: uploadedThumbnail.public_id
        };
    }

    // Create post
    const post = await Post.create({
        owner: req.user._id,
        section: section || null,
        media,
        thumbnail,
        caption: caption?.trim() || ""
    });

    return res.status(201).json(
        new ApiResponse(201, post, "Post created successfully!")
    );
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const posts = await Post.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
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
                from: "sections",
                localField: "section",
                foreignField: "_id",
                as: "section",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
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
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
                pipeline: [
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
                            from: "likes",
                            let: { commentId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$comment", "$$commentId"] }
                                    }
                                },
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
                            ],
                            as: "likes"
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                            likesCount: { $size: "$likes" },
                            likes: "$likes"
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                section: { $first: "$section" },
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, posts, "Posts fetched successfully!")
    );
});

const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    const posts = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
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
                from: "sections",
                localField: "section",
                foreignField: "_id",
                as: "section",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
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
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
                pipeline: [
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
                            from: "likes",
                            let: { commentId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$comment", "$$commentId"] }
                                    }
                                },
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
                            ],
                            as: "likes"
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                            likesCount: { $size: "$likes" },
                            likes: "$likes"
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                section: { $first: "$section" },
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    if (!posts || posts.length === 0) {
        throw new ApiError(404, "Post not found!");
    }

    return res.status(200).json(
        new ApiResponse(200, posts[0], "Post fetched successfully!")
    );
});

const getSectionPosts = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        throw new ApiError(400, "Invalid section ID");
    }

    const sectionExists = await Section.exists({
        _id: sectionId
    });

    if (!sectionExists) {
        throw new ApiError(404, "Section not found!");
    }

    const posts = await Post.aggregate([
        {
            $match: {
                section: new mongoose.Types.ObjectId(sectionId)
            }
        },
        {
            $sort: {
                createdAt: -1
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
                from: "sections",
                localField: "section",
                foreignField: "_id",
                as: "section",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
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
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
                pipeline: [
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
                            from: "likes",
                            let: { commentId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$comment", "$$commentId"] }
                                    }
                                },
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
                            ],
                            as: "likes"
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                            likesCount: { $size: "$likes" },
                            likes: "$likes"
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                section: { $first: "$section" },
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, posts, "Section posts fetched successfully!")
    );
});

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.aggregate([
        {
            $sort: {
                createdAt: -1
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
                from: "sections",
                localField: "section",
                foreignField: "_id",
                as: "section",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
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
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
                pipeline: [
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
                            from: "likes",
                            let: { commentId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$comment", "$$commentId"] }
                                    }
                                },
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
                            ],
                            as: "likes"
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                            likesCount: { $size: "$likes" },
                            likes: "$likes"
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                section: { $first: "$section" },
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    // Shuffle posts dynamically so every feed view delivers a fresh randomized order
    const shuffledPosts = [...posts];
    for (let i = shuffledPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]];
    }

    return res.status(200).json(
        new ApiResponse(200, shuffledPosts, "All posts fetched successfully in randomized order!")
    );
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { caption, section, sectionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found!");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized: Only the owner of this post can edit it!");
    }

    const updateData = {};

    // Caption
    if (caption !== undefined) {
        updateData.caption = caption.trim();
    }

    // Section
    const chosenSection = sectionId !== undefined ? sectionId : section;
    if (chosenSection !== undefined) {
        updateData.section = (chosenSection && mongoose.Types.ObjectId.isValid(chosenSection))
            ? new mongoose.Types.ObjectId(chosenSection)
            : null;
    }

    // Thumbnail
    if (req.file) {
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path);
        if (!uploadedThumbnail) {
            throw new ApiError(400, "Failed to upload new thumbnail!");
        }

        if (post.thumbnail?.public_id) {
            await deleteFromCloudinary(post.thumbnail.public_id, "image");
        }

        updateData.thumbnail = {
            url: uploadedThumbnail.secure_url,
            public_id: uploadedThumbnail.public_id
        };
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: updateData },
        { new: true }
    )
        .populate("owner", "username fullName avatar")
        .populate("section", "name");

    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Post updated successfully!")
    );
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findOne({
        _id: postId,
        owner: req.user._id
    });

    if (!post) {
        throw new ApiError(404, "Post not found or you are not the owner!");
    }

    // 1. Find all comments on this post to cascade delete their likes
    const postComments = await Comment.find({ post: postId }).select("_id");
    const commentIds = postComments.map((c) => c._id);

    // 2. Cascade delete all likes on the comments of this post
    if (commentIds.length > 0) {
        await Like.deleteMany({ comment: { $in: commentIds } });
    }

    // 3. Cascade delete all comments on this post
    await Comment.deleteMany({ post: postId });

    // 4. Cascade delete all likes directly on this post
    await Like.deleteMany({ post: postId });

    // 5. Delete Cloudinary media files
    for (const file of post.media) {
        if (file.public_id) {
            try {
                await deleteFromCloudinary(file.public_id, file.type);
            } catch (err) {
                console.log("Cloudinary media delete error:", err);
            }
        }
    }

    // 6. Delete Cloudinary thumbnail
    if (post.thumbnail?.public_id) {
        try {
            await deleteFromCloudinary(post.thumbnail.public_id, "image");
        } catch (err) {
            console.log("Cloudinary thumbnail delete error:", err);
        }
    }

    // 7. Delete the Post document itself
    await Post.findByIdAndDelete(postId);

    return res.status(200).json(
        new ApiResponse(200, post, "Post and all associated comments and likes deleted successfully!")
    );
});

const updatePostSection = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { sectionId } = req.body;

    const post = await Post.findOne({
        _id: postId,
        owner: req.user._id
    });

    if (!post) {
        throw new ApiError(404, "Post not found or you are not the owner!");
    }

    // Remove from section
    if (sectionId === null) {
        post.section = null;
        await post.save();

        return res.status(200).json(
            new ApiResponse(200, post, "Post removed from section!")
        );
    }

    // Add / move to section
    const section = await Section.findOne({
        _id: sectionId,
        owner: req.user._id
    });

    if (!section) {
        throw new ApiError(404, "Section not found or you are not the owner!");
    }

    post.section = sectionId;
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Post added to section successfully!")
    );
});

export {
    createPost,
    getUserPosts,
    getPostById,
    getSectionPosts,
    getAllPosts,
    updatePost,
    deletePost,
    updatePostSection
};