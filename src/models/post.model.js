import mongoose from "mongoose";
import {User} from "./user.model.js"

const postSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true,
        index:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    images:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true});

export const Post = mongoose.model('Post',postSchema) 