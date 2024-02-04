import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});


connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log('Error App failed: ', err);
        });
        app.listen(process.env.PORT || 3000, () => {
            console.log(`app is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`MongoDb connection Failed : `, err);
    });

export { cloudinary };