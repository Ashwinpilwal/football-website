import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import { Chat } from "../models/chat.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


// Generate Access and Refresh Token

const generateAccessAndRefreshToken = async (userId) => {

    try {

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token!");

    }

};


// Register User

const registerUser = asyncHandler(async (req, res) => {

    // Getting user details from frontend

    const { fullName, email, username, password } = req.body;

    // Validation - not empty

    if ([fullName, email, username, password].some((field) => !field || field.trim() === "")) {

        if (req.files?.avatar?.[0]?.path) {
            fs.unlinkSync(req.files.avatar[0].path);
        }

        if (req.files?.coverImage?.[0]?.path) {
            fs.unlinkSync(req.files.coverImage[0].path);
        }

        throw new ApiError(400, "All fields are required!");

    }


    // Checking if user already exists

    const existedUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    });

    if (existedUser) {
        throw new ApiError(409, "Username or email already exists!");
    }


    // Check for files and images

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required!");
    }


    // Upload avatar to Cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed!");
    }


    // Upload cover image if provided

    let coverImage = null;

    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }


    // Create user object - create entry in DB
    const role = req.body.role === "admin" ? "admin" : "user";

    const user = await User.create({
        fullName,
        avatar: {
            url: avatar.url,
            public_id: avatar.public_id
        },
        coverImage: {
            url: coverImage?.url || "",
            public_id: coverImage?.public_id || ""
        },
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        role
    });


    // Remove password and refresh token from response

    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    // Check for user creation

    if (!createdUser) {
        throw new ApiError(500, "User not created!");
    }


    // Return response

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User Registered Successfully!"
        )
    );

});


// Login User

const loginUser = asyncHandler(async (req, res) => {

    // Getting login details

    const { email, username, password } = req.body;

    // Checking username/email

    if (!email && !username) {
        throw new ApiError(400, "Username or email is required!");
    }

    if (!password) {
        throw new ApiError(400, "Password is required!");
    }


    // Find user

    const user = await User.findOne({
        $or: [
            ...(username ? [{ username: username.toLowerCase() }] : []),
            ...(email ? [{ email: email.toLowerCase() }] : [])
        ]
    });

    if (!user) {
        throw new ApiError(404, "User not found!");
    }


    // Check password

    const comparePassword = await user.isPasswordCorrect(password);

    if (!comparePassword) {
        throw new ApiError(401, "Password is incorrect!");
    }


    // Generate Access and Refresh Token
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

    // If location is provided during login, update user location
    const { lat, lon, city, address } = req.body;
    if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
        user.location = {
            lat: Number(lat),
            lon: Number(lon),
            city: city || "",
            address: address || "",
            updatedAt: new Date()
        };
        await user.save({ validateBeforeSave: false });
    }

    // Remove sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


    // Sending Cookies

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };


    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User LoggedIn Successfully!"
            )
        );

});


// Logout User

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );


    // Cookie options

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };


    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out Successfully!"
            )
        );

});


// Refresh Access Token

const refreshAccessToken = asyncHandler(async (req, res) => {

    // Getting refresh token from cookie or request body

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request!");
    }


    // Decoding refresh token

    let decodedToken;

    try {

        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

    } catch (error) {

        throw new ApiError(401, "Invalid refresh token or token might be expired!");

    }


    // Getting user data

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "User not found!");
    }


    // Comparing refresh token

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is expired or invalid!");
    }


    // Generate new tokens

    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = await generateAccessAndRefreshToken(user._id);


    // Cookie options

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };


    // Send new tokens

    return res.status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                },
                "Token Updated Successfully!"
            )
        );

});


// Change Current Password

const changeCurrentPassword = asyncHandler(async (req, res) => {

    // Getting old and new password

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required!");
    }


    // Getting user data

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401, "User not found!");
    }


    // Comparing password

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect!");
    }


    // Making changes in password

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });


    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password Changed Successfully!"
        )
    );

});


// Get Current User

const getCurrentUser = asyncHandler(async (req, res) => {

    // Middleware already provides current user

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: req.user
            },
            "User found Successfully!"
        )
    );

});


// Update Account Details

const updateAccountDetails = asyncHandler(async (req, res) => {

    const {
        fullName,
        email,
        favouriteCountry,
        favouriteClub,
        favouritePlayer,
        showOnlineStatus,
        privacy
    } = req.body;


    // Checking if something was provided
    if (
        fullName === undefined &&
        email === undefined &&
        favouriteCountry === undefined &&
        favouriteClub === undefined &&
        favouritePlayer === undefined &&
        showOnlineStatus === undefined &&
        privacy === undefined
    ) {
        throw new ApiError(400, "No input is present to be updated!");
    }


    // Creating update object
    const updateData = {};


    // Basic details
    if (fullName !== undefined) {
        updateData.fullName = fullName;
    }

    if (email !== undefined) {
        updateData.email = email.toLowerCase();
    }


    // Favourite country
    if (favouriteCountry !== undefined) {
        updateData.favouriteCountry = favouriteCountry;
    }


    // Favourite club
    if (favouriteClub !== undefined) {
        updateData.favouriteClub = favouriteClub;
    }


    // Favourite player
    if (favouritePlayer !== undefined) {
        updateData.favouritePlayer = favouritePlayer;
    }

    // Privacy & Online status
    if (showOnlineStatus !== undefined) {
        updateData.showOnlineStatus = Boolean(showOnlineStatus);
        updateData["privacy.showOnlineStatus"] = Boolean(showOnlineStatus);
    }

    if (privacy !== undefined) {
        if (typeof privacy === "object" && privacy !== null) {
            if (privacy.showOnlineStatus !== undefined) {
                updateData.showOnlineStatus = Boolean(privacy.showOnlineStatus);
                updateData["privacy.showOnlineStatus"] = Boolean(privacy.showOnlineStatus);
            }
            if (privacy.showLastSeen !== undefined) {
                updateData["privacy.showLastSeen"] = Boolean(privacy.showLastSeen);
            }
        }
    }


    // Updating user

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");


    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "User data is successfully updated!"
        )
    );

});


// Update User Avatar

const updateUserAvatar = asyncHandler(async (req, res) => {

    // Getting old avatar

    const userAvatarPublicId = req.user?.avatar?.public_id;


    // Getting avatar from frontend

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar not found in local storage!");
    }


    // Uploading avatar to Cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) {
        throw new ApiError(400, "Cannot upload avatar on Cloudinary!");
    }


    // Updating avatar in database

    const userData = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: {
                    url: avatar.url,
                    public_id: avatar.public_id
                }
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");


    // Deleting old avatar from Cloudinary

    if (userAvatarPublicId) {
        await deleteFromCloudinary(userAvatarPublicId, "image");
    }


    // Returning response

    return res.status(200).json(
        new ApiResponse(
            200,
            userData,
            "Avatar successfully updated!"
        )
    );

});


// Update User Cover Image

const updateUserCoverImage = asyncHandler(async (req, res) => {

    // Getting old cover image

    const userCoverImagePublicId = req.user?.coverImage?.public_id;


    // Getting cover image from frontend

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image not found in local storage!");
    }


    // Uploading cover image to Cloudinary

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage?.url) {
        throw new ApiError(400, "Cannot upload cover image on Cloudinary!");
    }


    // Updating cover image in database

    const userData = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: {
                    url: coverImage.url,
                    public_id: coverImage.public_id
                }
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");


    // Deleting old cover image from Cloudinary

    if (userCoverImagePublicId) {
        await deleteFromCloudinary(userCoverImagePublicId, "image");
    }


    // Returning response

    return res.status(200).json(
        new ApiResponse(
            200,
            userData,
            "Cover image successfully updated!"
        )
    );

});


// Get User Profile

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing!");
    }


    // Finding user

    const user = await User.findOne({
        username: username.toLowerCase()
    }).select("-password -refreshToken");


    if (!user) {
        throw new ApiError(404, "User not found!");
    }


    // Getting follower and following counts

    const followersCount = await Follow.countDocuments({
        following: user._id
    });

    const followingCount = await Follow.countDocuments({
        follower: user._id
    });


    // Checking whether current user follows this user

    let isFollowing = false;

    if (req.user?._id && !req.user._id.equals(user._id)) {

        const follow = await Follow.findOne({
            follower: req.user._id,
            following: user._id
        });

        isFollowing = !!follow;

    }


    const profile = {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
        coverImage: user.coverImage,
        favouriteCountry: user.favouriteCountry,
        favouriteClub: user.favouriteClub,
        favouritePlayer: user.favouritePlayer,
        followersCount,
        followingCount,
        isFollowing
    };


    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "User profile fetched successfully!"
        )
    );

});


// Get Watch History

const getWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

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
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }

                ]
            }
        }
    ]);


    return res.status(200).json(
        new ApiResponse(
            200,
            user[0]?.watchHistory || [],
            "Watch History Fetched Successfully!"
        )
    );

});


// Get All Users

const getAllUsers = asyncHandler(async (req, res) => {
    const { query, q, search } = req.query;
    const searchTerm = (query || q || search || "").trim();

    if (searchTerm) {
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
        const users = await User.find({
            $or: [
                { username: { $regex: regex } },
                { fullName: { $regex: regex } },
                { email: { $regex: regex } },
                { favouriteClub: { $regex: regex } },
                { favouritePlayer: { $regex: regex } }
            ]
        })
        .select("-password -refreshToken")
        .limit(15);

        return res.status(200).json(
            new ApiResponse(200, users, "Users matching search fetched successfully!")
        );
    }

    const users = await User.aggregate([
        // Get random users
        {
            $sample: {
                size: 20
            }
        },

        // Remove sensitive information
        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully!"
        )
    );
});


// Get Suggested Users

const getSuggestedUsers = asyncHandler(async (req, res) => {

    const users = await User.aggregate([

        // Exclude logged-in user

        {
            $match: {
                _id: {
                    $ne: req.user._id
                }
            }
        },


        // Find whether current user already follows each user

        {
            $lookup: {
                from: "follows",

                let: {
                    userId: "$_id"
                },

                pipeline: [

                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$follower",
                                            req.user._id
                                        ]
                                    },
                                    {
                                        $eq: [
                                            "$following",
                                            "$$userId"
                                        ]
                                    }
                                ]
                            }
                        }
                    }

                ],

                as: "follow"
            }
        },


        // Keep only users that current user does not follow

        {
            $match: {
                follow: {
                    $size: 0
                }
            }
        },


        // Remove unnecessary/private fields
        {
            $project: {
                password: 0,
                refreshToken: 0,
                watchHistory: 0
            }
        },

        // Random users every request
        {
            $sample: {
                size: req.query.limit ? (req.query.limit === "all" ? 500 : Math.max(1, Number(req.query.limit) || 100)) : 100
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Suggested users fetched successfully!"
        )
    );

});

// Haversine distance calculator
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Update user location coordinates
const updateUserLocation = asyncHandler(async (req, res) => {
    const { lat, lon, city, address } = req.body;

    if (lat === undefined || lon === undefined || lat === null || lon === null) {
        throw new ApiError(400, "Latitude and Longitude are required!");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                "location.lat": Number(lat),
                "location.lon": Number(lon),
                "location.city": city || "",
                "location.address": address || "",
                "location.updatedAt": new Date()
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Location updated successfully!")
    );
});

// Get nearby users based on coordinates
const getNearbyUsers = asyncHandler(async (req, res) => {
    let lat = req.query.lat ? Number(req.query.lat) : req.user?.location?.lat;
    let lon = req.query.lon ? Number(req.query.lon) : req.user?.location?.lon;

    const users = await User.find({
        _id: { $ne: req.user._id },
        "location.lat": { $ne: null },
        "location.lon": { $ne: null }
    }).select("fullName username avatar favouriteClub favouritePlayer favouriteCountry location isOnline createdAt");

    let withDistance = users.map((u) => {
        const uObj = u.toObject();
        if (lat !== undefined && lon !== undefined && lat !== null && lon !== null && u.location?.lat != null && u.location?.lon != null) {
            const dist = calculateDistanceKm(lat, lon, u.location.lat, u.location.lon);
            uObj.distanceKm = Number(dist.toFixed(1));
        } else {
            uObj.distanceKm = null;
        }
        return uObj;
    });

    withDistance.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
    });

    return res.status(200).json(
        new ApiResponse(200, withDistance, "Nearby users fetched successfully")
    );
});

// Get random users for discovery chatting (excluding users you've texted or share group chats with)
const getDiscoverUsers = asyncHandler(async (req, res) => {
    // 1. Fetch all chats where req.user._id is a participant
    const userChats = await Chat.find({
        participants: req.user._id
    }).select("participants");

    // 2. Collect all participant user IDs
    const excludedUserIdsSet = new Set();
    excludedUserIdsSet.add(req.user._id.toString());

    userChats.forEach((chat) => {
        if (Array.isArray(chat.participants)) {
            chat.participants.forEach((pId) => {
                if (pId) {
                    excludedUserIdsSet.add(pId.toString());
                }
            });
        }
    });

    const excludedObjectIds = Array.from(excludedUserIdsSet).map(
        (id) => new mongoose.Types.ObjectId(id)
    );

    // 3. Sample users who are not in excludedObjectIds
    const users = await User.aggregate([
        {
            $match: {
                _id: { $nin: excludedObjectIds }
            }
        },
        {
            $sample: {
                size: 30
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
                watchHistory: 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, users, "Discover users fetched successfully")
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getAllUsers,
    getSuggestedUsers,
    updateUserLocation,
    getNearbyUsers,
    getDiscoverUsers
};