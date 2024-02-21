import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";


const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "Please provide videoid.");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                as: "owner",
                from: "users",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{
                    $project: {
                        username: 1,
                    }
                }]
            }
        },
        {
            $lookup: {
                as: "likes",
                from: "likes",
                localField: "_id",
                foreignField: "comment",
            }
        },
        {
            $lookup: {
                as: "dislikes",
                from: "dislikes",
                localField: "_id",
                foreignField: "comment",
            }
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes"
                },
                dislikes: {
                    $size: "$dislikes"
                },
                owner: "$owner.username"
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                likes: 1,
                dislikes: 1,
                createdAt: 1
            }
        }
    ]);

    if (!comments) {
        return res.status(200).json(new ApiResponse(200, "comment is not exist."));
    }

    return res.status(200).json(new ApiResponse(200, "comment fetched.", comments));
});

const getTweetComments = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!tweetId) {
        throw new ApiError(400, "Please provide tweetId.");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                as: "owner",
                from: "users",
                localField: "owner",
                foreignField: "_id",
            }
        },
        {
            $lookup: {
                as: "likes",
                from: "likes",
                localField: "_id",
                foreignField: "comment",
            }
        },
        {
            $lookup: {
                as: "dislikes",
                from: "dislikes",
                localField: "_id",
                foreignField: "comment",
            }
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes"
                },
                dislikes: {
                    $size: "$dislikes"
                },
                owner: "$owner.username"
            }
        },
        {
            $project: {
                content: 1,
                likes: 1,
                dislikes: 1,
                owner: 1,
            }
        }
    ]);

    if (!comments) {
        return res.status(200).json(new ApiResponse(200, "comment is not exist."));
    }


    res.status(200).json(new ApiResponse(200, "tweet fetched.", comments));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId, content, tweetId } = req.body;
    const owner = req?.user._id;

    if (!owner) {
        throw new ApiError(400, "please enter owner id.");
    }

    if (!content) {
        throw new ApiError(400, "please enter content.");
    }

    if (!videoId && !tweetId) {
        throw new ApiError(400, "please enter video id.");
    }

    let comment;
    if (tweetId) {
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            throw new ApiError(400, "this tweet is not exist.");
        }
        comment = await Comment.create({ owner: owner, content: content, tweet: tweetId });
    }

    if (videoId) {
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(400, "this video is not exist.");
        }
        comment = await Comment.create({ owner: owner, content: content, video: videoId });
    }

    if (!comment) {
        throw new ApiError(400, "comment is not created.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "comment created successfully.", { _id: comment._id, content: comment.content }));
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "please provide a comment id.");
    }

    if (!content) {
        throw new ApiError(400, "please enter a something.");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(400, "comment not exist.");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "you are not auther of this comment.");
    }

    comment.content = content;
    const updatedComment = await comment.save();

    if (!updatedComment) {
        throw new ApiError(500, "comment is not updated.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "comment updated successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiResponse(401, "please enter a comment id.");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(400, "comment not exist.");
    }

    if (comment.owner.toString() !== req?.user._id.toString()) {
        throw new ApiError(400, "you are not allowed to delete this comment.");
    }

    const status = await Comment.findByIdAndDelete(commentId);

    if (!status) {
        throw new ApiError(500, "comment not deleted.something is wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "comment deleted successfully."));
});


export { getVideoComments, getTweetComments, addComment, updateComment, deleteComment };