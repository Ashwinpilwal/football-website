import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema({
    name:{
        type: String,
        // unique: true,
        required: true
    },
    coverImage: {
        url: {
            type: String,  //cloudinary url
            required: true,
        },
        public_id: {
            type: String,  //cloudinary public_id
            required: true,
        }
    },
    description: {
        type: String,
        required: true
    },
    visibility: {
        type: Boolean,
        default: false
    },
    videos:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Playlist = mongoose.model("Playlist", playlistSchema)