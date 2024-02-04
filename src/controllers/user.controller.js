import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import fs from 'fs';

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

        const uplodedAvatarPath = await cloudinary(avatarImagePath);
        const uplodedCoverImagePath = await cloudinary(coverImagePath);

        if (!uplodedAvatarPath) {
            throw new ApiError(400, "avatar file is required.");
        }

        const user = await User.create({ email, username: username.toLowerCase(), fullName, password, avatar: uplodedAvatarPath?.url, coverImage: uplodedCoverImagePath?.url });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

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

    const user = await User.findOne({ $or: [{ email }, { username }] });
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials.");
    }

    const { refreshToken, accessToken } = await generateTokens(user);

    const option = {
        httpOnly: true,
        secure: true
    };

    user.refreshToken = undefined;
    user.password = undefined;

    res.status(200).cookie("refreshToken", refreshToken, option).cookie("accessToken", accessToken, option).json(new ApiResponse(200, { data: user, accessToken, refreshToken }));
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

    res.status(200).clearCookie("refreshToken", option).clearCookie("accessToken", option).json(new ApiResponse(200, {}, "user logged out."));
});

export { registerUser, logOut, login };