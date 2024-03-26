import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponce.js";


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const ownerId = req?.user._id;

    if (!content) {
        throw new ApiError(400, "please enter something!");
    }

    if (!ownerId) {
        throw new ApiError(400, "please enter ownerId!");
    }

    const tweet = await Tweet.create({ content, owner: ownerId });

    if (!tweet) {
        throw new ApiError(500, "Tweets cannot be created.something went wrong!");
    }

    return res.status(200).json(new ApiResponse(200, "tweets created successfully.", tweet._id));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType } = req.query;
    const sortOption = {};
    sortOption[sortBy] = sortType === "desc" ? "-1" : "1";

    const { userId } = req.params;

    try {
        if (!userId) {
            throw new ApiError(400, "please enter owner ID.");
        }

        const tweets = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "users",
                    as: "owner",
                    localField: "owner",
                    foreignField: "_id",
                    pipeline: [{
                        $lookup: {
                            from: "subscriptions",
                            as: "subscribers",
                            localField: "_id",
                            foreignField: "channel",
                        }
                    },
                    {
                        $addFields: {
                            isSubscribed: {
                                $cond: [req?.user !== undefined, { $in: [new mongoose.Types.ObjectId(req?.user?._id), "$subscribers.subscriber"] }, false]
                            },
                            subscribers: {
                                $size: "$subscribers"
                            }
                        }
                    },
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,
                            subscribers: 1,
                            isSubscribed: 1
                        }
                    }]
                }
            }
        ]);

        if (!tweets.length) {
            return res.status(200).json(new ApiResponse(200, "Tweet is not exist."));
        }
        return res.status(200).json(new ApiResponse(200, "Tweets fetched successfully.", tweets));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "Tweets are not fetched.something went wrong.");
    }
});

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    try {
        if (!tweetId) {
            throw new ApiError(400, "please enter tweet id.");
        }

        if (!content) {
            throw new ApiError(400, "please enter content.");
        }

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(400, "tweet is not exist.");
        }

        if (tweet.owner.toString() !== req?.user._id.toString()) {
            throw new ApiError(401, "you are not allowed to update this tweet.");
        }

        tweet.content = content;
        const updatedTweet = await tweet.save();

        return res.status(200).json(new ApiResponse(200, "tweet updated successfully.", updatedTweet));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "tweet is not updated.something went wrong.");
    }
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "please enter tweet id.");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "tweet is not exist.");
    }

    if (tweet.owner.toString() !== req?.user._id.toString()) {
        throw new ApiError(401, "you are not allowed to delete this tweet.");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(500, "tweet is not deleted.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "tweet deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };