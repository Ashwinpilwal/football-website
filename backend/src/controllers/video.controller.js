import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { pipeline } from "stream";
import { subscribe } from "diagnostics_channel";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

const uploadVideo = asyncHandler( async(req, res) => {

// Checking if user exists, btw there is no need because middleware is already doing that.
    if(!req.user){
        throw new ApiError(400, "login required to upload video!")
    }

// Getting data from form- 
    const {title, description, sectionId} = req.body

// Validating data-(All fields are required)-
    if(
        [title, description].some(
            (field) => !field || field.trim() === "" 
        )
    ){
        if(req.files?.video?.[0]?.path){
            fs.unlinkSync(req.files?.video?.[0]?.path)
        }
        if(req.files?.thumbnail?.[0]?.path){
            fs.unlinkSync(req.files?.thumbnail?.[0]?.path)
        }

        throw new ApiError(400, "All fiels are required")
    } 

// Validating sectionId if provided, and checking if the section belongs to the user or not.
    if (sectionId) {

        const section = await Section.findOne({
            _id: sectionId,
            owner: req.user._id
        });

        if (!section) {
            throw new ApiError(
                404,
                "Section not found"
            );
        }
    }

// Uploading them on cloudinary
    const videoFile = req.files?.video?.[0]?.path
    const thumbnailFile = req.files?.thumbnail?.[0]?.path 

    if(!videoFile || !thumbnailFile){
        throw new ApiError(400, "video and thumbnail both are required!")
    }

    const uploadedVideo = await uploadOnCloudinary(videoFile)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile)

    if(!uploadedVideo || !uploadedThumbnail){
        throw new ApiError(400, "failed to upload image in cloudinary!")
    }
    // console.log("uploaded Video: ", uploadedVideo)
    // console.log("uploaded Thumbnail: ", uploadedThumbnail)


// Uploading image on MongoDB( creating video model object)

// console.log(uploadedThumbnail)


    let video
    try{
     
        video = await Video.create({
            videoFile: {
                url: uploadedVideo?.url,
                public_id: uploadedVideo?.public_id
            },
            thumbnail: {
                url: uploadedThumbnail?.secure_url,
                public_id: uploadedThumbnail?.public_id,
            },
            title,
            description,
            duration: uploadedVideo?.duration || 0,
            owner: req.user._id,
            section: sectionId || null
        })

    }catch(error){
        const a = await deleteFromCloudinary(uploadedThumbnail.public_id, "image")
        const b = await deleteFromCloudinary(uploadedVideo.public_id, "video")
            
        // console.log("deleteThumb",a)
        // console.log("deleteVid",b)

        throw new ApiError(400, "video cannot be uploaded. Thumbnail and video deleted from cloudinary!")  
    }


    // console.log(video )


// Sending the response-
    res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video successfully Uploaded!"
        )
    )

})

const getEveryUserVideos = asyncHandler( async(req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const aggregate = Video.aggregate([
        {
            $match:{
                isPublished: true
            }
        },
        {
            $sample: {
                size: 1000
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                videoFile: 1,
                views: 1,
                createdAt: 1,

                "owner._id": 1,
                "owner.username": 1,
                "owner.fullName": 1,
                "owner.avatar": 1
            }   
            
        }
    ])

    const selectedVideos = await Video.aggregatePaginate(
        aggregate,
        {
            page,
            limit
        }
    )

    res.status(200).json(
        new ApiResponse(
            200,
            selectedVideos,
            "all videos are fetched"
        )
    )

})

const getAllVideos = asyncHandler( async(req, res) => {
  
// Getting user from params
    const {username} = req.params

// Getting user data from DB
    const user = await User.findOne({
        username: username?.toLowerCase()
    })

    if(!user){
        throw new ApiError(404, "User not found")
    }

// Getting Page and Limit from queries
const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) || 10


// Fetching all the video of that user from DB

// Without aggregationPagination
    // const allVideos = await Video.aggregate([
    //     {
    //         $match: {
    //             owner: user._id
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "owner",
    //             foreignField: "_id",
    //             as: "owner",

    //             pipeline:[
    //                 {
    //                     $project: {
    //                         _id: 0,
    //                         username: 1,
    //                         fullName: 1,
    //                         avatar: 1
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $addFields: {
    //             owner: {
    //                 $first: "$owner"
    //             }
    //         }
    //     },
    //     {
    //         $project:{
    //             _id: 0,
    //             thumbnail: 1,
    //             title: 1,
    //             views:1,
    //             duration:1,
    //             owner: 1
    //         }
    //     }
    // ])

    const aggregate = Video.aggregate([
        {
            $match: {
                owner: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",

                pipeline:[
                    {
                        $project: {
                            _id: 0,
                            username: 1,
                            fullName: 1,
                            avatar: "$avatar.url"
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
        },
        {
            $project:{
                _id: 1,
                thumbnail: "$thumbnail.url",
                title: 1,
                description: 1,
                views:1,
                duration:1,
                owner: 1
            }
        }
    ])


// Doing Pagination
    const selectedVideos = await Video.aggregatePaginate(
        aggregate,
        {
            page, 
            limit
        }
    )


// Returning the response
    res.status(200).json(
        new ApiResponse(
            200,
            {
                // count: selectedVideos,
                videos: selectedVideos,
            },
            "videos fetched successfully!"
        )
    )

})


const getVideoById = asyncHandler( async(req, res) => {

// Getting video Id from params
    const {videoId} = req.params


// Checking id ObjectId is valid or not.
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "invalid video id!")
    }
  
// Incrementing the views of that video by 1
    await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        },
        // {
        //     new: true
        // }
    )

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
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
                        $project:{
                            _id: 0,
                            username: 1,
                            fullName: 1,
                            // email: 1,
                            avatar: "$avatar.url", 
                            // coverImage: 1,
                            // createdAt: 1
                        }
                    }
                ]
            }
            
        },
        {
            $addFields:{
                owner:{
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                videoFile: "$videoFile.url",
                thumbnail: "$thumbnail.url", // We dont need this, but sending in case if need this
                title: 1,
                description: 1,
                views: 1,
                duration: 1,
                createdAt: 1,
                owner: 1,
            }
        }

    ])

    
    if(video.length === 0){
        throw new ApiError(404, "Video not found or already deleted!")
    }

    
    res.status(200).json(
        new ApiResponse(
            200,
            video[0],
            "video fetched successfully"
        )
    )
})


const deleteVideoById = asyncHandler( async(req, res) => {

// Getting video id from params 
    const {videoId} = req.params

    // console.log(videoId)


// Checking is video id is valid
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "invalid video id!")
    }


// Checking the ownership
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "video cannot be fetched from database, or already deleted.")
    }

    if(req.user?._id.toString() !== video?.owner.toString()){
        throw new ApiError(403, "you are not the owner of this video!")
    }

// Storing the public ids of video and thumbnail to delete them from cloudinary
    const videoPublicId = video.videoFile.public_id
    const thumbnailPublicId = video.thumbnail.public_id


// Deleting all the comments and likes and *"likes on the comments" on this video 
// Deleting all the likes on comments
    const comments = await Comment.find({
        video: videoId
    }).select("_id")

    const commentsIds = comments.map((comment) => comment._id)

    await Like.deleteMany({
        comment:{
            $in: commentsIds
        }
    })

// deleting all the likes on the video
    await Like.deleteMany({
        video: videoId
    })

// deleting all the comments on the video
    await Comment.deleteMany({
        video: videoId
    })    

// deleting video from database
    const response = await Video.findByIdAndDelete(videoId)
    // console.log(response)

    
// Sending response to use user
    if(!response){
        throw new ApiError(404, "video cannot be deleted")
    }

// Deleting video and thumbnail from cloudinary
    if(videoPublicId){
        await deleteFromCloudinary(videoPublicId, "video")
    }
    
    if(thumbnailPublicId){
        await deleteFromCloudinary(thumbnailPublicId, "image")
    }

// sending the response
    res.status(200).json(
        new ApiResponse(
            200,
            response ,
            "video deleted successfully"
        )
    )
})



const togglePublishStatus = asyncHandler( async(req, res) => {

// Getting video from params
    const {videoId} = req.params
    // console.log(videoId)


// Checking if videoId is valid
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "video id is wrong or is not longer available")
    }


    
// Fetching video details from database
    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Unable to fetch video info from DB!")
    }
    
    
// Checking the ownership of this video
    if(req.user?._id.toString() !== video.owner.toString()){
        throw new ApiError(403, "sorry you are not the owner of this video!")
    }
    
// Changing publish status from the video
    video.isPublished = !video.isPublished
    await video.save()


// sending the final response
    res.status(200).json(
        new ApiResponse(
            200,
            video,
            "published status changed!"
        )
    )
})


const updateVideo = asyncHandler( async(req, res) => {

    const {videoId} = req.params

// Checking if videoId is valid
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "video id is wrong or is not longer available")
    }

// Fetching video details from database
    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Unable to fetch video info from DB!")
    }


// Checking video ownership
    if (req.user?._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "You are not the owner of this video!");
    }



// Getting form data and updating video
    // Text fields:
    const {title, description} = req.body

    // file fields:
    let oldThumbnail = ""
    
    if(req.file){
        
        oldThumbnail = video.thumbnail.public_id
        
        // console.log(oldThumbnail)

        // console.log(req.file)

        
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path)
        
        if(!uploadedThumbnail){
            throw new ApiError(500, "failed to upload on cloudinary!")
        }
        
        video.thumbnail = {
            url: uploadedThumbnail.url,
            public_id: uploadedThumbnail.public_id 
        }
        
    }
    
    if(title){
        video.title = title
    }
    if(description){
        video.description = description
    }
        
    await video.save()
    const response1 = await deleteFromCloudinary(oldThumbnail, "image") // deleting the old thumbnail
    // console.log(response1)
    

// Sending the final response. 
    res.status(200).json(
        new ApiResponse(
            200,
            video,
            "video updated!"
        )
    )
})




export {uploadVideo, getEveryUserVideos, getAllVideos, getVideoById, deleteVideoById, togglePublishStatus, updateVideo}
