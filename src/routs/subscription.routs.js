import { Router } from "express";
import { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers } from "../controllers/subscription.controller.js";
import { verifyToken, tokenDecoder } from "../middlewares/auth.middleware.js";
const subscriptionRouter = Router();

subscriptionRouter.route("/get-subscribed-channels/:channelId").get(tokenDecoder, getSubscribedChannels);
subscriptionRouter.route("/get-user-channel-subscribers/:channelId").get(tokenDecoder, getUserChannelSubscribers);

//secure routes
subscriptionRouter.route("/toggle-subscription/:channelId").post(verifyToken, toggleSubscription);

export { subscriptionRouter };