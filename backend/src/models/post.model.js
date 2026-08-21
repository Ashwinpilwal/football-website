import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    section: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        default: null
    },

    media: [
        {
            url: {
                type: String,
                required: true
            },

            public_id: {
                type: String,
                required: true
            },

            type: {
                type: String,
                enum: ["image", "video"],
                required: true
            }
        }
    ],

    thumbnail: {
        url: {
            type: String,
            default: ""
        },

        public_id: {
            type: String,
            default: ""
        }
    },

    caption: {
        type: String,
        default: ""
    }

}, { timestamps: true });


export const Post = mongoose.model("Post", postSchema);