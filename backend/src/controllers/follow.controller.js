import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";



const followToggle = asyncHandler(async(req, res) => {

// Getting user details from middleware
    const user = req.user

    if(!user){
        throw new ApiError(401, "You must be logged in to follow!")
    }


// Getting target user from params
    const {username} = req.params

    const targetUser = await User.findOne({
        username: username.toLowerCase()
    })

    if(!targetUser){
        throw new ApiError(404, "User you are trying to follow not found!")
    }


// Preventing user from following himself
    if(user._id.equals(targetUser._id)){
        throw new ApiError(400, "You cannot follow yourself!")
    }


// Checking if user already follows this user
    const isAlreadyFollowing = await Follow.findOne({
        follower: user._id,
        following: targetUser._id
    });

// If already following -> unfollow cleanly
    if (isAlreadyFollowing) {
        await Follow.deleteMany({
            follower: user._id,
            following: targetUser._id
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    isFollowing: false
                },
                "Successfully unfollowed!"
            )
        );
    }

// Create following entry
    const follow = await Follow.create({
        follower: user._id,
        following: targetUser._id
    });

// Returning response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                isFollowing: true,
                follow
            },
            "Successfully followed!"
        )
    );
});



const getUserFollowers = asyncHandler(async(req, res) => {
    const {username} = req.params;
    const page = req.query.page ? Number(req.query.page) : null;
    const limit = req.query.limit ? Number(req.query.limit) : (page ? 30 : null);

    const user = await User.findOne({
        username: username.toLowerCase()
    });

    if(!user){
        throw new ApiError(404, "User not found!");
    }

    const matchStage = {
        following: new mongoose.Types.ObjectId(user._id)
    };

    const pipeline = [
        {
            $match: matchStage
        },
        {
            $lookup:{
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "follower",
                pipeline:[
                    {
                        $project:{
                            _id: 1,
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
                follower:{
                    $first: "$follower"
                }
            }
        },
        {
            $sort:{
                createdAt: -1
            }
        },
        {
            $project:{
                _id: 1,
                createdAt: 1,
                follower: 1
            }
        }
    ];

    if (page && limit) {
        const totalDocs = await Follow.countDocuments(matchStage);
        const totalPages = Math.ceil(totalDocs / limit) || 1;
        const skip = (page - 1) * limit;

        pipeline.push({ $skip: skip }, { $limit: limit });

        const followers = await Follow.aggregate(pipeline);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    docs: followers,
                    totalDocs,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                "Followers fetched successfully!"
            )
        );
    }

    const followers = await Follow.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(
            200,
            followers,
            followers.length === 0
                ? "No followers."
                : "Followers fetched successfully!"
        )
    );
});

const getUserFollowing = asyncHandler(async(req, res) => {
    const {username} = req.params;
    const page = req.query.page ? Number(req.query.page) : null;
    const limit = req.query.limit ? Number(req.query.limit) : (page ? 30 : null);

    const user = await User.findOne({
        username: username.toLowerCase()
    });

    if(!user){
        throw new ApiError(404, "User not found!");
    }

    const matchStage = {
        follower: new mongoose.Types.ObjectId(user._id)
    };

    const pipeline = [
        {
            $match: matchStage
        },
        {
            $lookup:{
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "following",
                pipeline:[
                    {
                        $project:{
                            _id: 1,
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
                following:{
                    $first: "$following"
                }
            }
        },
        {
            $project:{
                _id: 0,
                following: 1
            }
        }
    ];

    if (page && limit) {
        const totalDocs = await Follow.countDocuments(matchStage);
        const totalPages = Math.ceil(totalDocs / limit) || 1;
        const skip = (page - 1) * limit;

        pipeline.push({ $skip: skip }, { $limit: limit });

        const following = await Follow.aggregate(pipeline);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    docs: following,
                    totalDocs,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                "Following fetched successfully!"
            )
        );
    }

    const following = await Follow.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(
            200,
            following,
            following.length === 0
                ? "Not following anyone."
                : "Following fetched successfully!"
        )
    );
});

const getMyFollowing = asyncHandler(async(req, res) => {
    const page = req.query.page ? Number(req.query.page) : null;
    const limit = req.query.limit ? Number(req.query.limit) : (page ? 30 : null);

    const matchStage = {
        follower: new mongoose.Types.ObjectId(req.user._id)
    };

    const pipeline = [
        {
            $match: matchStage
        },
        {
            $lookup:{
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "following",
                pipeline:[
                    {
                        $project:{
                            _id: 1,
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
                following:{
                    $first: "$following"
                }
            }
        },
        {
            $project:{
                _id: 0,
                following: 1
            }
        }
    ];

    if (page && limit) {
        const totalDocs = await Follow.countDocuments(matchStage);
        const totalPages = Math.ceil(totalDocs / limit) || 1;
        const skip = (page - 1) * limit;

        pipeline.push({ $skip: skip }, { $limit: limit });

        const following = await Follow.aggregate(pipeline);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    docs: following,
                    totalDocs,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                "Following fetched successfully!"
            )
        );
    }

    const following = await Follow.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(
            200,
            following,
            "Following fetched successfully!"
        )
    );
});



const getMyFollowers = asyncHandler(async(req, res) => {

    const followers = await Follow.aggregate([

        {
            $match:{
                following: new mongoose.Types.ObjectId(req.user._id)
            }
        },

        {
            $lookup:{
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "follower",

                pipeline:[
                    {
                        $project:{
                            _id: 1,
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
                follower:{
                    $first: "$follower"
                }
            }
        },

        {
            $sort:{
                createdAt: -1
            }
        },

        {
            $project:{
                _id: 1,
                createdAt: 1,
                follower: 1
            }
        }

    ])


    return res.status(200).json(
        new ApiResponse(
            200,
            followers,
            "Followers fetched successfully!"
        )
    )
})



export {
    followToggle,
    getUserFollowers,
    getUserFollowing,
    getMyFollowers,
    getMyFollowing
}