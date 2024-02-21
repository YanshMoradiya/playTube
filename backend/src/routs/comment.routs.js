import { Router } from "express";
import { addComment, updateComment, deleteComment, getVideoComments, getTweetComments } from "./../controllers/comment.controller.js";
import { verifyToken } from "./../middlewares/auth.middleware.js";

const commentRoute = Router();

commentRoute.route("/get-video-comments/:videoId").get(getVideoComments);
commentRoute.route("/get-tweet-comments/:tweetId").get(getTweetComments);

//secure routes
commentRoute.route("/add-comment").post(verifyToken, addComment);
commentRoute.route("/update-comment/:commentId").patch(verifyToken, updateComment);
commentRoute.route("/delete-comment/:commentId").delete(verifyToken, deleteComment);

export { commentRoute };