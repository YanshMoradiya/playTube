import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponce.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    try {
        if (!channelId) {
            throw new ApiError(400, "please enter channel id.");
        }

        const isSubscribed = await Subscription.find({ channel: channelId, subscriber: req?.user._id });

        if (channelId === req?.user._id.toString()) {
            throw new ApiError(401, "you are owner of this channel.");
        }

        if (isSubscribed.length) {
            await Subscription.deleteOne({ channel: channelId, subscriber: req?.user._id });

            return res.status(200).json(new ApiResponse(200, "Unsubscribed."));
        } else {
            await Subscription.create({ channel: channelId, subscriber: req?.user._id });

            return res.status(200).json(new ApiResponse(200, "Subscribed."));
        }
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "operation not done.something went wrong.");
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    try {
        if (!channelId) {
            throw new ApiError(400, "Please enter channel id.");
        }

        const channelSunscriber = await Subscription.aggregate([
            {
                $match: {
                    channel: new mongoose.Schema.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    as: "userDetails",
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }]
                }
            },
        ]);

        if (!channelSunscriber) {
            throw new ApiError(400, "subscriber not fetched.something went wrong.");
        }

        return res.status(200).json(new ApiResponse(200, "subscriber fatched.", { subscriberCount: channelSunscriber.length, channelSunscriber }));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "subscriber not fetched.something went wrong.");
    }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    try {
        if (!channelId) {
            throw new ApiError(400, "Please enter channel id.");
        }

        const subscribedChannels = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Schema.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    as: "channelDetails",
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }]
                }
            },
        ]);

        if (!subscribedChannels) {
            throw new ApiError(400, "channel is not fetched.something went wrong.");
        }

        return res.status(200).json(new ApiResponse(200, "channel fatched.", { subscriberedChannelCount: subscribedChannels.length, subscribedChannels }));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message || "channel is not fetched.something went wrong.");
    }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
