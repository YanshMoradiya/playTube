import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const videoData = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                as: "Likes",
                from: "likes",
                localField: "_id",
                foreignField: "video",
                pipeline: []
            }
        },
        {
            $addFields: {
                Likes: {
                    $size: { "$ifNull": ["$Likes", []] }
                }
            }
        },
        {
            $lookup: {
                as: "Subscribers",
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel"
            }
        },
        {
            $addFields: {
                Subscribers: {
                    $size: { "$ifNull": ["$Subscribers", []] }
                }
            }
        },
        {
            $group: {
                _id: null,
                Likes: {
                    $sum: "$Likes"
                },
                View: {
                    $sum: "$views"
                },
                Videos: {
                    $sum: 1
                },
                Subscribers: {
                    $first: "$Subscribers"
                }
            }
        },
        {
            $project: {
                Likes: 1,
                View: 1,
                Videos: 1,
                Subscribers: 1
            }
        }
    ]);

    if (!videoData) {
        throw new ApiError("400", "Data not found.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "video data fetch.", videoData));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "please enter user id.");
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                thumbnail: 1,
                title: 1,
                duration: 1,
                createdAt: 1
            }
        }
    ]);

    if (!videos) {
        throw new ApiError(400, "video not found.");
    }

    return res.status(200).json(new ApiResponse(200, "videos fetched successfully.", videos));
})

export { getChannelStats, getChannelVideos }


