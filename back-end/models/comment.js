import {model, Schema} from "mongoose";

const commentSchema = new Schema({
    text: {type: String, required: true, trim: true},
    task: {type: Schema.Types.ObjectId, required: true, ref: "Task"},
    author: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    mentions: [
        {
            user: {type: Schema.Types.ObjectId, ref: "User"},
            offset: {type: Number},
            length: {type: Number},
        },
    ],
    reactions: [
        {
            emoji: {type: String},
            user: {type: Schema.Types.ObjectId, ref: "User"},
        },
    ],
    attachments: [
        {
            fileName: {type: String},
            fileUrl: {type: String},
            fileType: {type: String},
            fileSize: {type: Number},
        },
    ],
    isEdited: {
        type: Boolean,
        default: false,
    },
});

const Comment = model("Comment", commentSchema);
export default Comment;
