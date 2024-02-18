import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { Playlist } from "./../models/playlist.model.js";
import { Video } from "./../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "please enter a name of a playlist.");
    }

    const playlist = await Playlist.create({ name, description, owner: req.user._id });

    if (!playlist) {
        throw new ApiError(500, "playlist is not created.something is wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "playlist created successfully.", { name: playlist.name, description: playlist.description }))
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        if (!userId) {
            throw new ApiError(400, "please enter user id.");
        }

        const playlists = await Playlist.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                },
            },
        ]);

        if (!playlists) {
            return res.status(200).json(new ApiResponse(200, "playlist is not exist."));
        }

        return res.status(200).json(new ApiResponse(200, "playlists fetched successfully.", playlists));
    } catch (error) {
        throw new ApiError(500, "playlists is not fetched.something went wrong!");
    }
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "please enter playlist id.");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                as: "owner",
                from: "users",
                localField: "owner",
                foreignField: "_id",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        username: 1
                    }
                }]
            }
        },
        {
            $lookup: {
                as: "videos",
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                pipeline: [{
                    $lookup: {
                        as: "owner",
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        pipeline: [{
                            $project: {
                                fullName: 1
                            }
                        }]
                    }
                },
                {
                    $project: {
                        thumbnail: 1,
                        title: 1,
                        views: 1,
                        duration: 1,
                        createdAt: 1,
                        owner: 1
                    }
                }]
            }
        }

    ]);

    if (!playlist) {
        throw new ApiError(400, "playlist not exist.");
    }

    return res.status(200).json(new ApiResponse(200, "playlist fetched successfully.", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    if (!playlistId || !videoId) {
        throw new ApiError(400, `please enter ${!playlistId ? "playlist" : "video"} id.`);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found.");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "you are not allowed to update playlist.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found.");
    }

    if (playlist.videos.includes(videoId)) {
        return res.status(200).json(new ApiResponse(200, "video is already in this playlist."));
    }
    playlist.videos.push(videoId);
    const newPlaylist = await playlist.save();

    if (!newPlaylist) {
        throw new ApiError(500, "video is not added.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, `video add in ${playlist.name} playlist.`));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    if (!playlistId || !videoId) {
        throw new ApiError(400, `please enter ${!playlistId ? "playlist" : "video"} id.`);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "you are not allowed to do this operation.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found");
    }

    if (!playlist.videos.includes(videoId)) {
        return res.status(200).json(new ApiResponse(200, "video is not in this playlist."));
    }

    playlist.videos = playlist.videos.filter(item => item.toString() !== video._id.toString());
    const newPlaylist = await playlist.save();

    if (!newPlaylist) {
        throw new ApiError(500, "video is not removed.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "video removed successfully."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "please enter a playlist id.");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found.");
    }

    if (playlist.owner.toString() !== req?.user._id.toString()) {
        throw new ApiError(400, "you are not allowed to delete this playlist.");
    }

    const deletedPlaylist = await playlist.deleteOne();

    if (!deletedPlaylist) {
        throw new ApiError(500, "playlist is not deleted.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "playlist deleted successfully."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name = "", description = "" } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "please enter playlist id.");
    }

    if (!name.trim().length && !description.trim().length) {
        throw new ApiError(400, "please enter details.");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist is not found.");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "you are not allowed to update this playlist.");
    }

    if (name.trim().length) {
        playlist.name = name;
    }

    if (description.trim().length) {
        playlist.description = description;
    }

    const updatedPlaylist = await playlist.save();

    if (!updatedPlaylist) {
        throw new ApiError(500, "playlist is not updated.something is wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "playlist updated successfully."));
});


export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist };