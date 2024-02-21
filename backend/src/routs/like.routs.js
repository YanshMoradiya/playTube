import { Router } from "express";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "./../controllers/like.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.route("/toggle-video-like/:videoId").post(verifyToken, toggleVideoLike);
likeRouter.route("/toggle-comment-like/:commentId").post(verifyToken, toggleCommentLike);
likeRouter.route("/toggle-tweet-like/:tweetId").post(verifyToken, toggleTweetLike);
likeRouter.route("/get-liked-videos").get(verifyToken, getLikedVideos);

export { likeRouter, };