import mongoose, { Schema } from "mongoose";

const turfSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: ["turf", "playground"],
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: true
        },

        coordinates: {
            type: [Number],
            required: true
        }
    },

    images: {
        type: [String],
        default: []
    },

    thumbnail: {
        type: String,
        default: ""
    },

    pricePerHour: {
        type: Number,
        default: null
    },

    phone: {
        type: String,
        default: ""
    },

    openingTime: {
        type: String,
        default: ""
    },

    closingTime: {
        type: String,
        default: ""
    },

    amenities: {
        type: [String],
        default: []
    }

}, { timestamps: true });


turfSchema.index({
    location: "2dsphere"
});


export const Turf = mongoose.model("Turf", turfSchema, "turfs");