import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { Comment } from "./../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "Please provide videoid.");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Schema.Types.ObjectId(videoId)
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
                localField: "video",
                foreignField: "_id",
                pipeline: [{
                    $project: {
                        username: 1,
                    }
                }]
            }
        },
        {
            $addFields: {
                dateNow: new Date()
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                years: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$dateNow",
                        unit: "year"
                    }
                },
                months: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$dateNow",
                        unit: "month"
                    }
                },
                days: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$dateNow",
                        unit: "day"
                    }
                },
            }
        }
    ]);

    res.send(200).json(new ApiResponse(200, "comment fetched.", comments));
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
                tweet: tweetId
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
                localField: "tweet",
                foreignField: "_id",
                pipeline: [{
                    $project: {
                        username: 1,
                    }
                }]
            }
        },
        {
            $addFields: {
                dateNow: new Date()
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                years: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$dateNow",
                        unit: "year"
                    }
                },
                months: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$dateNow",
                        unit: "month"
                    }
                },
                days: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$dateNow",
                        unit: "day"
                    }
                },
            }
        }
    ]);

    res.send(200).json(new ApiResponse(200, "tweet fetched.", comments));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId = "", content, tweetId = "" } = req.body;
    const owner = req.user._id;

    if (!owner) {
        throw new ApiError(400, "please enter owner id.");
    }

    if (!content) {
        throw new ApiError(400, "please enter content.");
    }

    if (!videoId.trim() && !tweetId.trim()) {
        throw new ApiError(400, "please enter video id.");
    }

    const comment = await Comment.create({ owner, content, video: videoId, tweet: tweetId });

    if (!comment) {
        throw new ApiError(400, "comment is not created.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "comment fetched successfully.", comment));
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

    if (comment.owner !== req.user._id) {
        throw new ApiError(400, "you are not auther of this comment.");
    }

    comment.content = content;
    const updatedComment = await comment.save();

    if (!updatedComment) {
        throw new ApiError(500, "comment is not updated.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "comment updated successfully.", updatedComment));
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

    if (comment.owner !== request.user._id) {
        throw new ApiError(400, "you are not auther of this comment.");
    }

    const status = await Comment.findByIdAndDelete(commentId);

    if (!status) {
        throw new ApiError(500, "comment not deleted.something is wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "comment deleted successfully."));
});


export { getVideoComments, getTweetComments, addComment, updateComment, deleteComment };