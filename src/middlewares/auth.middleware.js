import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import JWT from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";



//this is for protected Routes
export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.header["Authorization"]?.split(" ")[1] 
    || req.cookies?.accessToken;

    if(!token){
        throw new ApiError(401,"Unauthorized Request Missing Token");
    }

    try {
        const decodeToken = await JWT.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

        if(!user){ 
            throw new ApiError(401,"Unauthorized Request Invalid Token");
        }

        req.user = user;
        next();
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
        // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    }
})




//for unprotected Routes

export const getLoggedInUserorIgnore = asyncHandler( async(req,res,next)=>{

    const token = req.header["Authorization"]?.split(" ")[1] 
    || req.cookies?.accessToken;

    try {
        const decodeToken = await JWT.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

        if(!user){ 
            throw new ApiError(401,"Unauthorized Request Invalid Token");
        }

        req.user = user;
        next();
        
    } catch (error) {
        // fail silently and move on
        next();
    }


})
