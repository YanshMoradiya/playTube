import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './utils/glodalErrorHandler.js';
const app = express();

app.use(express.json({ limit: "16kb", }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routs import
import { userRouter } from './routs/user.routs.js';

//routs declaration
app.use("/api/v1/user", userRouter);
app.use(globalErrorHandler);

export { app }