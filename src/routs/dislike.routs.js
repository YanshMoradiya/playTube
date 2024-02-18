import { Router } from "express";
import { toggleVideoDislike, toggleTweetDisike, toggleCommentDislike, getDislikedVideos } from "./../controllers/dislike.controller.js";
import { verifyToken } from "./../middlewares/auth.middleware.js";
const dislikeRouter = Router();

dislikeRouter.route("/toggle-video-dislike/:videoId").post(verifyToken, toggleVideoDislike);
dislikeRouter.route("/toggle-tweet-disike/:tweetId").post(verifyToken, toggleTweetDisike);
dislikeRouter.route("/toggle-comment-dislike/:commentId").post(verifyToken, toggleCommentDislike);
dislikeRouter.route("/get-disliked-videos").get(verifyToken, getDislikedVideos);

export { dislikeRouter };