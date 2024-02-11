import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponce";
import { Playlist } from "./../models/playlist.model.js";
import { Video } from "./../models/video.model.js";

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

    if (!userId) {
        throw new ApiError(400, "please enter user id.");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
    ]);

    if (!playlists.length) {
        return res.status(200).json(new ApiResponse(200, "playlist is not exist."));
    }

    if (!playlists) {
        throw new ApiError(500, "playlist is not found.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "playlists fetched successfully.", playlists));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "please enter playlist id.");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not exist.");
    }

    return res.status(200).json(new ApiResponse(200, "playlist fetched successfully.", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, `please enter ${!playlistId ? "playlist" : "video"} id.`);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found.");
    }

    if (playlist.owner !== req.user._id) {
        throw new ApiError(401, "you are not allowed to do this operation.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found.");
    }

    playlist.videos.push(videoId);
    const newPlaylist = await playlist.save();

    if (!newPlaylist) {
        throw new ApiError(500, "video is not added.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, `video add in ${playlist.name} playlist.`));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, `please enter ${!playlistId ? "playlist" : "video"} id.`);
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    if (playlist.owner !== req.user._id) {
        throw new ApiError(401, "you are not allowed to do this operation.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "video not found");
    }

    const updatedPlaylist = playlist.videos.filter(item => item.id !== video._id);
    const newPlaylist = await updatedPlaylist.save();

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

    if (playlist.owner !== req.user._id) {
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
    const { name, description } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "please enter playlist id.");
    }

    if (!name && !description) {
        throw new ApiError(400, "please enter name or description.");
    }

    const playlist = await playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "playlist is not found.");
    }

    if (playlist.owner !== req.user._id) {
        throw new ApiError(400, "you are not allowed to update this playlist.");
    }

    if (name) {
        playlist.name = name;
    }

    if (description) {
        playlist.description = description;
    }

    const updatedPlaylist = await playlist.save();

    if (!updatedPlaylist) {
        throw new ApiError(500, "playlist is not updated.something is wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "playlist updated successfully."));
});


export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist };