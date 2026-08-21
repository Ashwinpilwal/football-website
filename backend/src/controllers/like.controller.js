import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";



const togglePostLike = asyncHandler(async(req, res) => {

// getting postId from frontend
    const {postId} = req.params


// checking if postId is valid and it exists in DB
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400, "invalid post id")
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new ApiError(404, "post not found in DB")
    }


// finding if like exists in DB --> We will find by (user and post)
    const isLiked = await Like.findOne({
        post: post._id,
        likedBy: req.user._id
    })


// if like doesn't exist -> create like
    if(!isLiked){

        const like = await Like.create({
            post: post._id,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "post is liked by user."
            )
        )
    }


// if like exists -> delete like
    const deletedLike = await Like.findByIdAndDelete(
        isLiked._id
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedLike,
            "post is unliked by user."
        )
    )
})



const toggleCommentLike = asyncHandler(async(req, res) => {

// getting commentId from frontend
    const {commentId} = req.params


// checking if commentId is valid and it exists in DB
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "invalid comment id")
    }


    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "comment not found in DB")
    }


// finding if like exists in DB --> We will find by (user and comment)
    const isLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })


// if like doesn't exist -> create like
    if(!isLiked){

        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "comment is liked by user."
            )
        )
    }


// if like exists -> delete like
    const deletedLike = await Like.findByIdAndDelete(
        isLiked._id
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedLike,
            "comment is unliked by user."
        )
    )
})



const toggleTweetLike = asyncHandler(async(req, res) => {

// getting tweetId from frontend
    const {tweetId} = req.params


// validating tweetId
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }


// fetching tweet from DB
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "tweet not found in DB")
    }


// finding if like already exists
    const isLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })


// if like doesn't exist
    if(!isLiked){

        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "tweet liked."
            )
        )
    }


// if like exists -> delete like from DB
    const deletedLike = await Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedLike,
            "tweet unliked."
        )
    )

})



const getLikedPosts = asyncHandler(async(req, res) => {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10


    const aggregate = Like.aggregate([
        {
            $match:{
                likedBy: req.user._id,
                post: {$exists: true}
            }
        },

        {
            $sort:{
                createdAt: -1
            }
        },

        {
            $lookup:{
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "post"
            }
        },

        {
            $addFields:{
                post:{
                    $first: "$post"
                }
            }
        },

        {
            $lookup:{
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedBy",

                pipeline:[
                    {
                        $project:{
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields:{
                likedBy:{
                    $first: "$likedBy"
                }
            }
        }
    ])


    const selectedLikedPosts = await Like.aggregatePaginate(
        aggregate,
        {
            page,
            limit
        }
    )


    return res.status(200).json(
        new ApiResponse(
            200,
            selectedLikedPosts,
            "here are your liked posts"
        )
    )
})



export {
    togglePostLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedPosts
}