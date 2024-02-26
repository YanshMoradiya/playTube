import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { uploadCloudinary, deleteCloudinary } from "./../utils/cloudinary.js";
import fs from "fs";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const sortOption = {};
    sortOption[sortBy] = sortType === "desc" ? "-1" : "1";

    const pipeline = [];

    if (query) {
        pipeline.push({
            $match: {
                $text: {
                    $search: query
                }
            }
        },
            {
                $skip: (page - 1) * limit
            }, {
            $limit: limit
        }, {
            $lookup: {
                from: "users",
                as: "owner",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        username: 1,
                    }
                }]
            }
        }, {
            $project: {
                thumbnail: 1,
                title: 1,
                duration: 1,
                owner: 1,
                createdAt: 1
            }
        });
    }

    if (!query && userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
            {
                $skip: (page - 1) * limit
            }, {
            $limit: limit
        }, {
            $lookup: {
                from: "users",
                as: "owner",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        username: 1,
                    }
                }]
            }
        }, {
            $project: {
                thumbnail: 1,
                title: 1,
                duration: 1,
                owner: 1,
                createdAt: 1
            }
        });
    }

    if (!query && !userId) {
        pipeline.push({
            $sample: {
                size: limit
            }
        });
    }

    const videos = await Video.aggregate(pipeline);

    if (!videos) {
        throw new ApiError(500, "Video not found.something is wrong.");
    }

    if (!videos.length) {
        throw new ApiError(400, "videos not exist.");
    }

    return res.status(200).json(new ApiResponse(200, "videos fethed successfully.", videos));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description = "" } = req.body;
    const videoFile = req.files?.video[0].path;
    const thumbnail = req.files?.thumbnail[0].path;

    if (!videoFile && !thumbnail) {
        throw new ApiError(400, "please enter video file and thumbnail.");
    }

    if (!title) {
        throw new ApiError(400, "please enter title.");
    }

    let cloudinaryThumbnailFile = undefined, cloudinaryVideoFile = undefined;

    try {
        cloudinaryThumbnailFile = await uploadCloudinary(thumbnail);
        cloudinaryVideoFile = await uploadCloudinary(videoFile);
    } catch (error) {
        if (cloudinaryThumbnailFile) {
            unlinkSync(videoFile);
            await deleteCloudinary(cloudinaryThumbnailFile, "image");
        }
        if (cloudinaryVideoFile) {
            unlinkSync(thumbnail);
            await deleteCloudinary(cloudinaryVideoFile, "video");
        }
        console.log(error)
        throw new ApiError(500, "video is not uploaded.something went wrong.");
    }

    const video = await Video.create({ title, description, owner: req?.user._id, thumbnail: cloudinaryThumbnailFile.url, videoFile: cloudinaryVideoFile.url, duration: cloudinaryVideoFile.duration });

    if (!video) {
        throw new ApiError(500, "video is not uploaded.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "video uploaded successfully.", video._id));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(500, "please enter a video id.");
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                as: "like",
                localField: "_id",
                foreignField: "video"
            }
        },
        {
            $lookup: {
                from: "dislikes",
                as: "dislike",
                localField: "_id",
                foreignField: "video"
            }
        },
        {
            $lookup: {
                from: "users",
                as: "owner",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{
                    $lookup: {
                        from: "subscriptions",
                        as: "subscribers",
                        localField: "_id",
                        foreignField: "channel",
                    }
                },
                {
                    $addFields: {
                        isSubscribed: {
                            $cond: [req?.user !== undefined, { $in: [new mongoose.Types.ObjectId(req?.user?._id), "$subscribers.subscriber"] }, false]
                        },
                        subscribers: {
                            $size: "$subscribers"
                        }
                    }
                },
                {
                    $project: {
                        fullName: 1,
                        avatar: 1,
                        subscribers: 1,
                        isSubscribed: 1
                    }
                }]
            }
        },
        {
            $addFields: {
                like: {
                    $size: "$like"
                },
                dislike: {
                    $size: "$dislike"
                }
            }
        }
    ]);

    if (!video.length) {
        throw new ApiError(400, "video is not found.");
    };
    video[0].owner = video[0].owner[0];

    return res.status(200).json(new ApiResponse(200, "video fetched successfully.", video[0]));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnail = req?.file?.path;

    if (!title && !description && !thumbnail) {
        throw new ApiError(400, "please enter a detail to update.");
    }

    if (!videoId) {
        throw new ApiError(500, "please enter a video id.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found.");
    }

    if (req?.user._id.toString() !== video.owner.toString()) {
        throw new ApiError("401", "You are not allowed to update this video.");
    }

    if (title) {
        video.title = title;
    }

    if (description) {
        video.description = description;
    }

    if (thumbnail) {
        try {
            const uploadThumbnailPath = await uploadCloudinary(thumbnail);
            await deleteCloudinary(video.thumbnail, "image");
            video.thumbnail = uploadThumbnailPath.url;
        } catch (error) {
            fs.unlinkSync(thumbnail);
            console.log(error)
            throw new ApiError(500, "video is not uploaded.something went wrong.")
        }
    }

    const updatedVideo = await video.save();

    if (!updatedVideo) {
        throw new ApiError(500, "video is not updated.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "video updated successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "please enter a video id.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found.");
    }

    if (req?.user._id.toString() !== video.owner.toString()) {
        throw new ApiError("401", "You are not allowed to update this video.");
    }

    video.isPublished = !video.isPublished;
    const updatedVideo = await video.save();

    return res.status(200).json(new ApiResponse(200, `video is ${updatedVideo.isPublished ? 'published' : 'unpublished'} successfully.`));
});

export { getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo };

