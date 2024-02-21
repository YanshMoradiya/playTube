import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import fs from 'fs';
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateTokens = async (user) => {
    try {
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { refreshToken, accessToken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating tokens.");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email, username, password, fullName } = req.body;

        if ([email, username, password, fullName].some((item) => item?.trim() === "")) {
            throw new ApiError(400, "All fields are required.");
        }

        if (!email.includes("@")) {
            throw new ApiError(400, "enter valid email address.");
        }

        const existedUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existedUser) {
            throw new ApiError(409, "User is already registered.");
        }

        let avatarImagePath = undefined;
        let coverImagePath = "";

        if (req.files?.avatar) {
            avatarImagePath = req.files?.avatar[0]?.path;
        }

        if (req.files?.coverImage) {
            coverImagePath = req.files?.coverImage[0]?.path;
        }

        if (!avatarImagePath) {
            throw new ApiError(400, "avatar file is required.");
        }

        const uplodedAvatarPath = await uploadCloudinary(avatarImagePath);
        const uplodedCoverImagePath = await uploadCloudinary(coverImagePath);

        if (!uplodedAvatarPath) {
            throw new ApiError(400, "avatar file is required.");
        }

        const user = await User.create({ email, username: username.toLowerCase(), fullName, password, avatar: uplodedAvatarPath?.url, coverImage: uplodedCoverImagePath?.url });

        const createdUser = await User.findById(user._id);

        if (!createdUser) {
            throw new ApiError(500, "something went wrong while registering user.");
        }

        return res.status(200).json(new ApiResponse(201, "User registered successfully.", { status: "Success", data: createdUser }));
    } catch (error) {
        console.log(error)
        if (req.files?.avatar) {
            fs.unlinkSync(req.files?.avatar[0]?.path);
        }
        if (req.files?.coverImage) {
            fs.unlinkSync(req.files?.coverImage[0]?.path);
        }
        throw new ApiError(error.statusCode, error.message);
    }
});

const login = asyncHandler(async (req, res, next) => {
    const { email, password, username } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Please enter email or username.");
    };

    let user = await User.findOne({ $or: [{ email }, { username }] }).select("+password +refreshToken");
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials.");
    }

    const { refreshToken, accessToken } = await generateTokens(user);

    user.refreshToken = refreshToken;
    const updatedUser = await user.save({ validateBeforeSave: false });
    const option = {
        httpOnly: true,
        secure: true
    };
    updatedUser.refreshToken = undefined;
    updatedUser.password = undefined;
    res.status(200).cookie("refreshToken", refreshToken, option).cookie("accessToken", accessToken, option).json(new ApiResponse(200, "loged in successfully.", { user: updatedUser, accessToken, refreshToken }));
});

const logOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, { new: true });

    const option = {
        httpOnly: true,
        secure: true
    };

    res.status(200).clearCookie("refreshToken", option).clearCookie("accessToken", option).json(new ApiResponse(200, "user logged out."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unouthorized request.");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedToken._id).select("+refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid refreshtoken.");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refreshtoken is expired.");
        };

        const { accessToken, refreshToken } = await generateTokens(user);

        const option = {
            httpOnly: true,
            secure: true
        };

        return res.status(200).cookie("refreshToken", refreshToken, option).cookie("accessToken", accessToken, option).json(new ApiResponse(200, "Access Token refreshed.", { refreshToken, accessToken }));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refreshtoken.");
    }
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(401, "Enter old password and new password.");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(401, "please enter new password other than old password.");
    };

    const isPasswordCorrect = await req.user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password.");
    };

    req.user.password = newPassword;
    const user = await req.user.save({ validateBeforeSave: false });
    user.password = undefined;
    return res.status(200).json(new ApiResponse(200, "Successfully updated password."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    req.user.password = undefined;
    res.status(200).json(new ApiResponse(200, "Current user fetched Successfully", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    if (req.body.email && !req.body.fullName) {
        req.user.email = req.body.email;
    }

    if (!req.body.email && req.body.fullName) {
        req.user.fullName = req.body.fullName;
    }

    if (req.body.email && req.body.fullName) {
        req.user.email = req.body.email;
        req.user.fullName = req.body.fullName;
    }

    if (!req.body.email && !req.body.fullName) {
        throw new ApiError(401, "please enter details.");
    }

    const user = await req.user.save({ validateBeforeSave: true });
    user.password = undefined;
    return res.status(200).json(new ApiResponse(200, "details updated successfully.", { fullName: user.fullName, email: user.email }));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            throw new ApiError(401, "Please enter file.");
        }

        const uploadFileToCloudinary = await uploadCloudinary(req.file.path);

        if (!uploadFileToCloudinary) {
            throw new ApiError(401, "Something went wrong while uploading file on server.");
        }

        const oldAvatarFileUrl = req.user.avatar;
        req.user.avatar = uploadFileToCloudinary.url;
        await req.user.save({ validateBeforeSave: true });

        const deleteOldFile = await deleteCloudinary(oldAvatarFileUrl, "image");

        if (!deleteOldFile) {
            throw new ApiError(401, "Something went wrong while deleting old file from server.");
        }

        return res.status(200).json(new ApiResponse(200, "file successfully updated."));
    } catch (error) {
        console.log(error)
        if (req.file) {
            fs.unlinkSync(req.file?.path);
        }
        throw new ApiError(error.statusCode, error.message);
    }
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    try {
        const oldCoverImageFileUrl = req.user.coverImage;
        if (req.file) {
            const uploadCoverImage = await uploadCloudinary(req.file?.path);

            if (!uploadCoverImage) {
                throw new ApiError(401, "Something went wrong while uploading cover image on server.");
            }
            req.user.coverImage = uploadCoverImage?.url;
        }
        else if (!req.file && req.user.coverImage) {
            req.user.coverImage = undefined;
        }

        await req.user.save({ validateBeforeSave: true });

        if (oldCoverImageFileUrl) {
            const deleteOldCoverImage = await deleteCloudinary(oldCoverImageFileUrl, "image");
            if (!deleteOldCoverImage) {
                throw new ApiError(401, "Something went wrong while deleting cover image from server.");
            }
        }

        return res.status(200).json(new ApiResponse(200, "cover image successfully updated."));
    } catch (error) {
        console.log(error)
        if (req.file) {
            fs.unlinkSync(req.file?.path);
        }
        throw new ApiError(error.statusCode, error.message);
    }
});

const getChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "please enter a username.");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            // for subscriber data
            $lookup: {
                as: "subscriberData",
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel"
            }
        },
        {
            // subscribed to data
            $lookup: {
                as: "subscribedToData",
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscriberData"
                },
                subscribedToCount: {
                    $size: "$subscribedToData"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscriberData.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                "username": 1,
                "email": 1,
                "fullName": 1,
                "avatar": 1,
                "coverImage": 1,
                "subscriberCount": 1,
                "subscribedToCount": 1,
                "isSubscribed": 1
            }
        }
    ]);

    if (!channel.length) {
        throw new ApiError(401, "channel does not exist.");
    }

    res.status(200).json(new ApiResponse(200, "channel fetched successfully.", channel[0]));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const watchHistory = await User.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [{
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [{
                            $project: {
                                fullName: 1,
                                username: 1,
                                avatar: 1
                            }
                        }]
                    },
                },
                {
                    $addFields: {
                        owner: {
                            $first: "$owner"
                        },
                        dateNow: new Date()
                    }
                },
                {
                    $project: {
                        thumbnail: 1,
                        title: 1,
                        owner: 1,
                        views: 1,
                        years: {
                            $dateDiff: {
                                startDate: "$createdAt",
                                endDate: "$dateNow",
                                unit: "year"
                            }
                        },
                        months: {
                            $dateDiff: {
                                startDate: "$createdAt",
                                endDate: "$dateNow",
                                unit: "month"
                            }
                        },
                        days: {
                            $dateDiff: {
                                startDate: "$createdAt",
                                endDate: "$dateNow",
                                unit: "day"
                            }
                        },
                    }
                }]
            },
        },
        {
            $project: {
                watchHistory: 1,
            }
        }
    ]);


    return res.status(200).json(new ApiResponse(200, "watch history fatched successfully.", watchHistory[0]));
});

export { registerUser, logOut, login, refreshAccessToken, changeCurrentUserPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getChannelProfile, getUserWatchHistory };