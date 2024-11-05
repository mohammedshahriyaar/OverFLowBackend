import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';

const dbConnect = async() => {
    try {
        const connectionObject = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(connectionObject.connection.host,connectionObject.connection.name);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export  default dbConnect