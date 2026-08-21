import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    coverImage: {
        url: {
            type: String,
            default: ""
        },

        public_id: {
            type: String,
            default: ""
        }
    }

}, { timestamps: true });


export const Section = mongoose.model(
    "Section",
    sectionSchema
);