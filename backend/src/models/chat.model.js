import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema({

    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    isGroupChat: {
        type: Boolean,
        default: false
    },

    groupName: {
        type: String,
        default: ""
    },

    groupIcon: {
        type: String,
        default: ""
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },


}, {timestamps: true})

export const Chat = mongoose.model("Chat", chatSchema)