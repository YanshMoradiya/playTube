import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };