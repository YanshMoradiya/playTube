import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "./../controllers/tweet.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const tweetRouter = Router();

tweetRouter.route("/create-tweet").post(verifyToken, createTweet);
tweetRouter.route("/get-user-tweets/:userId").get(getUserTweets);
tweetRouter.route("/update-tweet/:tweetId").patch(verifyToken, updateTweet);
tweetRouter.route("/delete-tweet/:tweetId").delete(verifyToken, deleteTweet);

export { tweetRouter };
