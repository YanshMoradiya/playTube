import { logOut, login, registerUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "./../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);
userRouter.route("/logIn").post(login);

//secure routs
userRouter.route("/logOut").get(verifyToken, logOut);

export { userRouter };