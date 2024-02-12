import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponce.js";
import { Like } from "./../models/like.model.js";
import { Video } from "./../models/video.model.js";
import { Comment } from "./../models/comment.model.js";
import { Tweet } from "./../models/tweet.model.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { isLiked } = req.body;

    try {
        if (isLiked === undefined) {
            throw new ApiError(400, "please enter like status.");
        }

        if (!videoId) {
            throw new ApiError(400, "Please enter video id.");
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(400, "video is not found.");
        }

        if (isLiked) {
            const unlike = await Like.findOneAndDelete({ likedBy: req?.user._id, video: videoId });

            if (!unlike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "remove like from this video."));
        } else {
            const like = await Like.create({ likedBy: req?.user._id, video: videoId });

            if (!like) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "like this video."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong.");
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { isLiked } = req.body;

    try {
        if (isLiked === undefined) {
            throw new ApiError(400, "please enter like status.");
        }

        if (!commentId) {
            throw new ApiError(400, "Please enter comment id.");
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(400, "comment is not found.");
        }

        if (isLiked) {
            const unlike = await Like.findOneAndDelete({ likedBy: req?.user._id, comment: commentId });

            if (!unlike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "remove like from this comment."));
        } else {
            const like = await Like.create({ likedBy: req?.user._id, comment: commentId });

            if (!like) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "like this comment."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong.");
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { isLiked } = req.body;

    try {
        if (isLiked === undefined) {
            throw new ApiError(400, "please enter like status.");
        }

        if (!tweetId) {
            throw new ApiError(400, "Please enter tweet id.");
        }

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(400, "tweet is not found.");
        }

        if (isLiked) {
            const unlike = await Like.findOneAndDelete({ likedBy: req?.user._id, tweet: tweetId });

            if (!unlike) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "remove like from this tweet."));
        } else {
            const like = await Like.create({ likedBy: req?.user._id, tweet: tweetId });

            if (!like) {
                throw new ApiError(500, "unable to do this operation.something went wrong.");
            }

            return res.status(200).json(new ApiResponse(200, "liked this tweet."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong.");
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const likedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Schema.Types.ObjectId(req?.user._id)
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

        if (!likedVideos.length) {
            throw new ApiError(400, "No video found.");
        }

        return res.status(200).json(new ApiResponse(200, "video fetched successfully.", { countOfLikedVideos: likedVideos.length, likedVideos }));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "something went wrong wrong.");
    }
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}