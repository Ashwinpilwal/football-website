import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    replyToUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);