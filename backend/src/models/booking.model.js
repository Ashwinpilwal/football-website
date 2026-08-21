import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    turf: {
      type: Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    slots: [
      {
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// TTL index to automatically purge expired tickets from MongoDB after the booked date/time passes
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Booking = mongoose.model("Booking", bookingSchema);