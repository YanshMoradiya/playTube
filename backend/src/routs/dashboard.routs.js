import { Router } from "express";
import { getChannelStats, getChannelVideos } from "./../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.route("/get-channel-stats/:userId").get(getChannelStats);
dashboardRouter.route("/get-channel-videos/:userId").get(getChannelVideos);

export { dashboardRouter };