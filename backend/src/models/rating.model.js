import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema(
  {
    turf: {
      type: Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      default: "",
      trim: true,
      maxLength: 1000,
    },
  },
  { timestamps: true }
);

// Compound unique index: 1 rating per user per turf
ratingSchema.index({ turf: 1, user: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema, "ratings");
