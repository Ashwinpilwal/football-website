import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    const photoLocalPath =
        req.files?.photo?.[0]?.path ||
        req.files?.image?.[0]?.path ||
        req.file?.path;

    if ((!content || !content.trim()) && !photoLocalPath) {
        throw new ApiError(400, "Tweet must contain text or a photo!");
    }

    let photoData = { url: "", public_id: "" };
    if (photoLocalPath) {
        const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
        if (uploadedPhoto?.url) {
            photoData = {
                url: uploadedPhoto.url,
                public_id: uploadedPhoto.public_id || ""
            };
        }
    }

    const tweet = await Tweet.create({
        content: content ? content.trim() : "",
        photo: photoData,
        owner: req.user._id
    });

    const populatedTweet = await Tweet.findById(tweet._id).populate(
        "owner",
        "username fullName avatar"
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            populatedTweet,
            "Tweet created successfully!"
        )
    );
});

// Fetch all community match tweets for the social feed
const getCommunityTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 100 },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
            }
        },
        { $addFields: { owner: { $first: "$owner" } } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "likedBy",
                            foreignField: "_id",
                            as: "likedBy",
                            pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
                        }
                    },
                    { $addFields: { likedBy: { $first: "$likedBy" } } }
                ]
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "tweet",
                as: "comments",
                pipeline: [
                    { $sort: { createdAt: -1 } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
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
                                        pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
                                    }
                                },
                                { $addFields: { likedBy: { $first: "$likedBy" } } }
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
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "Community tweets fetched successfully!"
        )
    );
});

const getAllUserTweets = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    // Support query by username or userId
    let query = {};
    if (mongoose.Types.ObjectId.isValid(username)) {
        query = { $or: [{ username }, { _id: new mongoose.Types.ObjectId(username) }] };
    } else {
        query = { username: username.toLowerCase() };
    }

    const user = await User.findOne(query);

    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    const tweets = await Tweet.aggregate([
        { $match: { owner: user._id } },
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
            }
        },
        { $addFields: { owner: { $first: "$owner" } } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "likedBy",
                            foreignField: "_id",
                            as: "likedBy",
                            pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
                        }
                    },
                    { $addFields: { likedBy: { $first: "$likedBy" } } }
                ]
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "tweet",
                as: "comments",
                pipeline: [
                    { $sort: { createdAt: -1 } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
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
                                        pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
                                    }
                                },
                                { $addFields: { likedBy: { $first: "$likedBy" } } }
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
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "User tweets fetched successfully!"
        )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { newContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    if (!newContent || !newContent.trim()) {
        throw new ApiError(400, "Tweet content cannot be empty.");
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user?._id
        },
        {
            $set: {
                content: newContent.trim()
            }
        },
        {
            new: true
        }
    );

    if (!updatedTweet) {
        throw new ApiError(403, "You are not the authorized user, cannot update in db!");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated!"
        )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: req.user._id
    });

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found or user is not the owner");
    }

    // 1. Find all comments on this tweet to cascade delete their likes
    const tweetComments = await Comment.find({ tweet: tweetId }).select("_id");
    const commentIds = tweetComments.map((c) => c._id);

    // 2. Cascade delete all likes on the comments of this tweet
    if (commentIds.length > 0) {
        await Like.deleteMany({ comment: { $in: commentIds } });
    }

    // 3. Cascade delete all comments on this tweet
    await Comment.deleteMany({ tweet: tweetId });

    // 4. Cascade delete all likes on this Tweet
    await Like.deleteMany({
        tweet: tweetId
    });

    // 5. Delete photo from Cloudinary if exists
    if (deletedTweet.photo?.public_id) {
        try {
            await deleteFromCloudinary(deletedTweet.photo.public_id);
        } catch (err) {
            console.log("Cloudinary photo delete error:", err);
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedTweet,
            "Tweet and all associated comments and likes deleted successfully!"
        )
    );
});

export {
    createTweet,
    getCommunityTweets,
    getAllUserTweets,
    updateTweet,
    deleteTweet
};