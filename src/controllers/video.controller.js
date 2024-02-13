import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { uploadCloudinary, deleteCloudinary } from "./../utils/cloudinary.js";
import fs from "fs";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const sortOption = {};
    sortOption[sortBy] = sortType === "desc" ? "-1" : "1";

    if (!query && !userId) {
        throw new ApiError(400, "Please enter userId or querystring.");
    }

    const pipeline = [];

    if (query) {
        pipeline.push({
            $match: {
                $text: {
                    $search: query
                }
            }
        });
    }

    if (!query && userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Schema.Types.ObjectId(userId)
            }
        });
    }

    pipeline.push({
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

    const video = await Video.create({ title, description, owner: req?.user._id, videoFile: cloudinaryThumbnailFile.url, thumbnail: cloudinaryVideoFile.url, duration: cloudinaryVideoFile.duration });

    if (!video) {
        throw new ApiError(500, "video is not uploaded.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "video uploaded successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(500, "please enter a video id.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video is not found.");
    };

    return res.status(200).json(new ApiResponse(200, "video fetched successfully.", video));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnail = req?.file.path;

    if (!title && !description && !thumbnail) {
        throw new ApiError(400, "please enter a detail to update.");
    }

    if (!videoId) {
        throw new ApiError(500, "please enter a video id.");
    }

    const video = await Video.getVideoById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found.");
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

    video.isPublished = !video.isPublished;
    const updatedVideo = await video.save();

    return res.status(200).json(new ApiResponse(200, `video is ${updatedVideo.isPublished ? 'published' : 'unpublished'} successfully.`));
});

export { getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo };

