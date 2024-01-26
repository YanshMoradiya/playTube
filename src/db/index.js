import mongoose from "mongoose";
import { db_NAME } from './../constants.js'

const connectDB = async () => {
    try {
        const connectDatabase = await mongoose.connect(`${process.env.MONGODB_URL}/${db_NAME}`);
        console.log('DATABASE CONNECTED SUCCESSFUL : ', connectDatabase.connection.host);
    } catch (error) {
        console.log("DATABASE CONNECTION FAILED", error);
    }
};

export default connectDB;