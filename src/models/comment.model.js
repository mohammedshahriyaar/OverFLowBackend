import mongoose from "mongoose";
import { Post } from "./post.model.js";
import { User } from "./user.model.js";

const commentSchema = new mongoose.Schema({

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
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

},{timestamps:true})


export const Comment = mongoose.model('Comment',commentSchema)