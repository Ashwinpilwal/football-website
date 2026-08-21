import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const createPlaylist = asyncHandler( async(req, res) => {

// getting data from req.body
    const {name, description, visibility} = req.body

// getting coverImage from req.file
    const coverImage = req.file
    if(!coverImage){
        throw new ApiError(400, "coverImage is required!")
    }

    const coverImageLocalPath = req.file.path
    const coverImageUploaded = await uploadOnCloudinary(coverImageLocalPath)

// creating a playlist
    const playlist = await Playlist.create({
        name,
        coverImage: {
            url: coverImageUploaded.url,
            public_id: coverImageUploaded.public_id
        },
        description,
        visibility: visibility || false,
        videos: [],
        owner: req.user._id
    })

// sending a response
    res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "playlist created."
        )
    )
})


const showAllPlaylist = asyncHandler( async(req, res) => {
    const playlists = await Playlist.find({

        // owner = mongoose.Types.ObjectId(req.user)
        owner: req.user._id
    })

    res.status(200).json(
        new ApiResponse(
            200, 
            playlists,
            "successfully fetched all playlists."
        )
    )
})


const addtoPlaylist = asyncHandler( async(req, res) => {

// getting videoId from params | playlist Name from body
    const {videoId} = req.params
    const {playlistId} = req.body 


// checking is videoId is valid | playName is there or not
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "video id is wrong")
    }
    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "playlist id is wrong")
    }


// adding video to playlist
    const playlist = await Playlist.findOneAndUpdate(
        {
            owner: req.user._id,
            _id: playlistId
        },
        {
            $addToSet:{
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if(!playlist){
        throw new ApiError(404, "playlistName is incorrect/not found or user.id not matched")
    }

    
// Sending a response 
    res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "video updated to playlist"
        )
    )

})


const deleteFromPlaylist = asyncHandler( async(req, res) => {

// getting videoId from params | playlist Name from body
    const {videoId} = req.params
    const {playlistId} = req.body 


// checking is videoId is valid | playName is there or not
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "video id is wrong")
    }
    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "playlist id is wrong")
    }


// adding video to playlist
    const playlist = await Playlist.findOneAndUpdate(
        {
            owner: req.user._id,
            _id: playlistId
        },
        {
            $pull:{
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if(!playlist){
        throw new ApiError(404, "playlistName is incorrect/not found or user.id not matched")
    }

    
// Sending a response 
    res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video removed from playlist successfully"
        )
    )

})


const updatePlaylist = asyncHandler( async(req, res) => {

// Playlist Name, Id, Description from body
    const {name, description} = req.body 
    const {playlistId} = req.params


// PlaylistId is there or not
    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "playlist id is wrong")
    }

// checking coverImage is there or not

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(403, "Playlist not found");
    }

    let oldCoverImage = playlist.coverImage
    let coverImage = playlist.coverImage

    if(req.file){
        coverImage = await uploadOnCloudinary(req.file.path) 
    }


// adding video to playlist
    let updatedPlaylist
    try{
        updatedPlaylist = await Playlist.findOneAndUpdate(
            {
                owner: req.user._id,
                _id: playlistId
            },
            {
                $set:{
                    name,
                    description,
                    coverImage: {
                        url: coverImage.url,
                        public_id: coverImage.public_id
                    }
                }
            },
            {
                new: true
            }
        )
    }catch(error){
        if(req.file && coverImage.public_id){
            await deleteFromCloudinary(coverImage.public_id, "image")
        }
        throw new ApiError(500, "Failed to update playlist.")
    }

    if (!updatedPlaylist) {
        if (req.file && coverImage.public_id) {
            await deleteFromCloudinary(coverImage.public_id, "image");
        }

        throw new ApiError(
            403,
            "Playlist not found or you are not the owner."
        );
    }
        

//deleting old cover image
    if(req.file && oldCoverImage?.public_id && oldCoverImage.public_id !== coverImage.public_id){
        await deleteFromCloudinary(oldCoverImage.public_id, "image")
    }

    
// Sending a response 
    res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Playlist updated successfully"
        )
    )

})


const deletePlaylist = asyncHandler( async(req, res) => {

// Playlist Name from body
    const {playlistId} = req.body 


// checking playName is there or not

    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "playlist id is wrong")
    }



// adding video to playlist
    const playlist = await Playlist.findOneAndDelete(
        {
            owner: req.user._id,
            _id: playlistId
        }
    )

    if(!playlist){
        throw new ApiError(404, "playlistName is incorrect/not found or user.id not matched")
    }

// deleting cover Image of this playlist
    await deleteFromCloudinary(playlist.coverImage.public_id, "image")

    
// Sending a response 
    res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist deleted successfully"
        )
    )

})


export {createPlaylist, showAllPlaylist, addtoPlaylist, deleteFromPlaylist, updatePlaylist, deletePlaylist}