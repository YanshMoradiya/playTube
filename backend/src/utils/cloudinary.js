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

const deleteCloudinary = async (urlOfFile, resource_type) => {
    try {
        if (!urlOfFile) return null;
        const publicId = urlOfFile.split("/")[7].substr(0, 20);
        const details = await cloudinary.uploader.destroy(publicId, { resource_type });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export { uploadCloudinary, deleteCloudinary };