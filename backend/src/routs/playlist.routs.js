import { Router } from "express";
import { createPlaylist, getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById, updatePlaylist, deletePlaylist } from "./../controllers/playlist.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const playlistRouter = Router();

playlistRouter.route("/create-playlist").post(verifyToken, createPlaylist);
playlistRouter.route("/get-user-playlists").get(verifyToken, getUserPlaylists);
playlistRouter.route("/add-video-to-playlist/:playlistId").post(verifyToken, addVideoToPlaylist);
playlistRouter.route("/remove-video-from-playlist/:playlistId").post(verifyToken, removeVideoFromPlaylist);
playlistRouter.route("/get-playlist-by-id/:playlistId").get(getPlaylistById);
playlistRouter.route("/update-playlist/:playlistId").post(verifyToken, updatePlaylist);
playlistRouter.route("/delete-playlist/:playlistId").delete(verifyToken, deletePlaylist);

export { playlistRouter };