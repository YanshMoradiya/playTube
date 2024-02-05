import { logOut, login, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "./../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(login);

//secure routs
userRouter.route("/logout").get(verifyToken, logOut);
userRouter.route("/refresh-access-token").post(refreshAccessToken);

export { userRouter };