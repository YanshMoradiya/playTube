import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './utils/glodalErrorHandler.js';
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.use(express.json({ limit: "16kb", }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routs import
import { userRouter } from './routs/user.routs.js';
import { videoRouter } from './routs/video.routs.js';
import { subscriptionRouter } from './routs/subscription.routs.js';
import { tweetRouter } from './routs/tweet.routs.js';
import { likeRouter } from './routs/like.routs.js';
import { commentRoute } from './routs/comment.routs.js';
import { playlistRouter } from './routs/playlist.routs.js';
import { dislikeRouter } from './routs/dislike.routs.js';
import { dashboardRouter } from './routs/dashboard.routs.js';


//routs declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dislike", dislikeRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use(globalErrorHandler);

export { app }