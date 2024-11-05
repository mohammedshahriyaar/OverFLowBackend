import mongoose from "mongoose";

import { Post } from "./post.model.js";
import { User } from "./user.model.js";
import { Comment } from "./comment.model.js";
const likeSchema = new mongoose.Schema({

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default: null
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default: null
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    
},{
    timestamps:true
})

export const Like = mongoose.model('Like',likeSchema)