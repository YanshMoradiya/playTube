import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, // cloudnary
        required: true,
    },
    thumbnail: {
        type: String, // cloudnary
        required: true,
    },
    title: {
        type: String,
        required: true,
        index: true,
    },
    discription: {
        type: String,
        index: true,
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model("Video", videoSchema);

export { Video };