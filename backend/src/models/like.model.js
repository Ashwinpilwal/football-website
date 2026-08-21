import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema({

    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

likeSchema.plugin(mongooseAggregatePaginate);

likeSchema.index({ likedBy: 1, post: 1 }, { unique: true, partialFilterExpression: { post: { $exists: true } } });
likeSchema.index({ likedBy: 1, comment: 1 }, { unique: true, partialFilterExpression: { comment: { $exists: true } } });
likeSchema.index({ likedBy: 1, tweet: 1 }, { unique: true, partialFilterExpression: { tweet: { $exists: true } } });

export const Like = mongoose.model("Like", likeSchema);