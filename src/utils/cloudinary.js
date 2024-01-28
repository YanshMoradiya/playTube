import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (urlOfFile) => {
    try {
        if (!urlOfFile) return null;
        const responce = await cloudinary.uploader.upload(urlOfFile, { resource_type: "auto" });
        console.log("File is uploaded successfully : ", responce.url);
        return responce;
    } catch (error) {
        fs.unlinkSync(urlOfFile);
        return null;
    }
};

export { cloudinary };