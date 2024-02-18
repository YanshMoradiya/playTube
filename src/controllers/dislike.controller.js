import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponce.js";
import { Dislike } from "./../models/dislike.model.js";
import { Video } from "./../models/video.model.js";
import { Comment } from "./../models/comment.model.js";
import { Tweet } from "./../models/tweet.model.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        if (!videoId) {
            throw new ApiError(400, "Please enter video id.");
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(400, "video is not found.");
        }

        const isDisiked = await Dislike.find({ dislikedBy: req?.user._id, video: videoId });

        if (isDisiked.length) {
            const undislike = await Dislike.findOneAndDelete({ dislikedBy: req?.user._id, video: videoId });

            if (!undislike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "remove dislike from this video."));
        } else {
            await Like.findOneAndDelete({ likedBy: req?.user._id, video: videoId });

            const dislike = await Dislike.create({ dislikedBy: req?.user._id, video: videoId });

            if (!dislike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "dislike this video."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong.");
    }
});

const toggleCommentDislike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    try {
        if (!commentId) {
            throw new ApiError(400, "Please enter comment id.");
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(400, "comment is not found.");
        }

        const isDisliked = await Dislike.find({ dislikedBy: req?.user._id, comment: commentId });

        if (isDisliked.length) {
            const undislike = await Dislike.findOneAndDelete({ dislikedBy: req?.user._id, comment: commentId });

            if (!undislike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "remove like from this comment."));
        } else {
            await Like.findOneAndDelete({ likedBy: req?.user._id, comment: commentId });

            const dislike = await Dislike.create({ dislikedBy: req?.user._id, comment: commentId });

            if (!dislike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "dislike this comment."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong.");
    }
});

const toggleTweetDisike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    try {
        if (!tweetId) {
            throw new ApiError(400, "Please enter tweet id.");
        }

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(400, "tweet is not found.");
        }

        const isDisliked = await Dislike.find({ dislikedBy: req?.user._id, tweet: tweetId });

        if (isDisliked.length) {
            const undislike = await Dislike.findOneAndDelete({ dislikedBy: req?.user._id, tweet: tweetId });

            if (!undislike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "remove dislike from this tweet."));
        } else {
            await Like.findOneAndDelete({ likedBy: req?.user._id, tweet: tweetId });

            const dislike = await Dislike.create({ dislikedBy: req?.user._id, tweet: tweetId });

            if (!dislike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "disliked this tweet."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong.");
    }
});

const getDislikedVideos = asyncHandler(async (req, res) => {
    try {
        const dislikedVideos = await Dislike.aggregate([
            {
                $match: {
                    dislikedBy: new mongoose.Types.ObjectId(req?.user._id),
                    video: {
                        $exists: true
                    }
                }
            },
            {
                $lookup: {
                    as: "videoDetails",
                    from: "videos",
                    localField: "video",
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

        if (!dislikedVideos.length) {
            throw new ApiError(400, "No video found.");
        }

        return res.status(200).json(new ApiResponse(200, "video fetched successfully.", { countOfDislikedVideos: dislikedVideos.length, dislikedVideos }));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong wrong.");
    }
});

export {
    toggleCommentDislike,
    toggleTweetDisike,
    toggleVideoDislike,
    getDislikedVideos
}