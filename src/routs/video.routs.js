import { Router } from "express";
import { publishAVideo, getVideoById, updateVideo, togglePublishStatus, getAllVideos } from "../controllers/video.controller.js";
import { verifyToken, tokenDecoder } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const videoRouter = Router();

videoRouter.route("/get-videos").get(getAllVideos);
videoRouter.route("/publish-video").post(verifyToken, upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), publishAVideo);
videoRouter.route("/get-video-by-id/:videoId").get(tokenDecoder, getVideoById);
videoRouter.route("/update-video/:videoId").patch(verifyToken, upload.single("thumbnail"), updateVideo);
videoRouter.route("/toggle-publish-status/:videoId").patch(verifyToken, togglePublishStatus);

export { videoRouter };