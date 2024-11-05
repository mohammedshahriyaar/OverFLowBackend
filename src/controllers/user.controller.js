import { User } from "../models/user.model.js";
import JWT from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId);
        console.log(user)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(400,"Error While Generating tokens",[])
    }

}


const registerUser = asyncHandler(async (req, res, next) => {

    const { username, email, password,fullName } = req.body;

    //check for existing user

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if(existingUser){
        throw new ApiError(400,"User already exists",[])
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName
    })

    if(!user){
        throw new ApiError(400,"Failed to create user",[])
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(400,"Unable to fetch Created User",[])
    }


    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
    )
});


const loginUser = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    console.log(req.body)

    if(!email || !password){ 
        throw new ApiError(400,"Please provide email and password",[])
    }

    const user = await User.findOne({ email })
    // console.log(user)

    if(!user){
        throw new ApiError(400,"User doesnt exist",[])
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(400,"Incorrect password",[])
    }


    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(new ApiResponse(200,loggedInUser,"User logged in successfully"))

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdandUpdate(req.user._id,{
        $unset:{refreshToken:1} // removes the refresh token from the user document
    },{
        new:true
    })

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie('accessToken',options)
    .cookie('refreshToken',options)
    .json(new ApiResponse(200,{},"User logged out successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const refreshAcessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken||req.headers?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(400,"UnAuthorized request",[])
    }

    const decoded = JWT.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

    const userIdfromToken = decoded._id;

    const dbUser = await User.findById(userIdfromToken);

    if(!dbUser){
        throw new ApiError(400,"Invalid Refresh TOken",[])
    }

    if(dbUser.refreshToken !== incomingRefreshToken){
        throw new ApiError(400,"Invalid Refresh TOken or refreshToken has expired or been used",[])
    }

    const options ={
        httpOnly: true,
        secure:true
    }

    const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(userIdfromToken);

    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',newrefreshToken,options)
    .json(new ApiResponse(200,{accessToken,refreshToken:newrefreshToken},"Access token refreshed successfully for user"))

})





export {registerUser,loginUser,logoutUser,getCurrentUser,refreshAcessToken}