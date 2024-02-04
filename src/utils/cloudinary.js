import fs from "fs";
import { cloudinary } from "../index.js";

const uploadCloudinary = async (urlOfFile) => {
    try {
        if (!urlOfFile) return null;
        const responce = await cloudinary.uploader.upload(urlOfFile, { resource_type: "auto" });
        fs.unlinkSync(urlOfFile);
        return responce;
    } catch (error) {
        fs.unlinkSync(urlOfFile);
        console.log(error);
        return null;
    }
};

export default uploadCloudinary;