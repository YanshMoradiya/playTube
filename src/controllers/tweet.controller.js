import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponce.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content, ownerId } = req.body;

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

    return res.status(200).json(new ApiResponse(200, "tweets created successfully.", tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { ownerId } = req.body;

    if (!ownerId) {
        throw new ApiError(400, "please enter owner ID.");
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: ownerId,
            }
        },
        {
            $lookup: {
                from: "likes",
                as: "likeCount",
                localField: "_id",
                foreignField: "tweet"
            }
        },
        {
            $addFields: {
                like: {
                    $size: "$likeCount"
                }
            }
        }
    ]);

    if (!tweets.length) {
        throw new ApiError(500, "Tweets are not fetched.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "Tweets fetched successfully.", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId, content } = req.body;

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

    if (tweet.owner !== req?.user._id) {
        throw new ApiError(401, "you are not allowed to update this tweet.");
    }

    tweet.content = content;
    const updatedTweet = await tweet.save();

    if (!updatedTweet) {
        throw new ApiError(500, "tweet is not updated.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "tweet updated successfully.", updatedTweet));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "please enter tweet id.");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "tweet is not exist.");
    }

    if (tweet.owner !== req?.user._id) {
        throw new ApiError(400, "you are not allowed to delete this tweet.");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(500, "tweet is not deleted.something went wrong.");
    }

    return res.status(200).json(new ApiResponse(200, "tweet deleted successfully."));
})

export { createTweet, getUserTweets, updateTweet, deleteTweet };