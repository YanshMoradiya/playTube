import { changeCurrentUserPassword, logOut, login, refreshAccessToken, registerUser, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "./../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(login);

//secure routs
userRouter.route("/logout").get(verifyToken, logOut);
userRouter.route("/refresh-access-token").post(refreshAccessToken);
userRouter.route("/change-current-user-password").post(verifyToken, changeCurrentUserPassword);
userRouter.route("/get-current-user").get(verifyToken, getCurrentUser);
userRouter.route("/update-user-account-details").patch(verifyToken, updateAccountDetails);
userRouter.route("/update-user-avatar-file").patch(verifyToken, upload.single("avatar"), updateUserAvatar);
userRouter.route("/update-user-cover-image").patch(verifyToken, upload.single("coverImage"), updateUserCoverImage);
userRouter.route("/get-user-channel-profile/:username").get(verifyToken, getUserChannelProfile);
userRouter.route("/get-watch-history").get(verifyToken, getWatchHistory);

export { userRouter };