import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema({
    content: {
        type: String,
        default: ""
    },
    photo: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    section: {  // if section: null, then tweet is not part of any section.
        type: Schema.Types.ObjectId,
        ref: "Section",
        default: null
    }
}, { timestamps: true });

tweetSchema.plugin(mongooseAggregatePaginate);

export const Tweet = mongoose.model("Tweet", tweetSchema);