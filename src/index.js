import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();

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