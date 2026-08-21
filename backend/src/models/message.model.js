import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const messageSchema = new Schema({
    chat:{
        type: Schema.Types.ObjectId,
        ref: "Chat"
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    message: {
        type: String,
        required: true
    },

    attachment: {
        type: String,
        enum: ["video", "image", "text", "file", "match_pass", "post"],
        default: "text"
    },

    matchPass: {
        type: Schema.Types.Mixed,
        default: null
    },

    sharedPost: {
        type: Schema.Types.Mixed,
        default: null
    },

    replyTo: {
        type: Schema.Types.Mixed,
        default: null
    },

    isRead: {
        type: Boolean,
        default: false
    },

    isEdited: {
        type: Boolean,
        default: false
    }

}, {timestamps: true}
) 

messageSchema.plugin(mongooseAggregatePaginate)

export const Message =  mongoose.model("Message", messageSchema)
