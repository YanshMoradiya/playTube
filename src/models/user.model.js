import { compare, hash } from "bcryptjs";
import mongoose, { Schema, SchemaType } from "mongoose";
import { sign } from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    awatar: {
        type: String,
        required: true, //cloudnary 
    },
    coverImage: {
        type: String, // cloudnary
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return sign({
        _id: _id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

userSchema.methods.generateRefreshToken = function () {
    return sign({
        _id: _id,
    }, process.env.REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

const User = mongoose.model("User", userSchema);

export { User };