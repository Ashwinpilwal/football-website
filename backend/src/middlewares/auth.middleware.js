import {User} from "../models/user.model.js"
import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req, _, next) => {

// getting token from req
    // const accessToken = req.cookies.accessToken //this is for webpages only
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") 

    if(!token){
        throw new ApiError(401, "Unauthorized access from auth Middleware!")
    }

    try{
    // decoding token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken)

    // getting userData from token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        

    // Adding userData to req object (our main goal of this middleware)
        req.user = user

        next()

    }catch(error){
        if(error.name === "TokenExpiredError"){
            throw new ApiError(401, "Token has expired")
        }
        throw new ApiError(401, "Invalid Access Token")
    }
})

export const verifyJWTOptional = asyncHandler(async(req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return next();
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (user) {
            req.user = user;
        }
    } catch (error) {
        // Continue as unauthenticated guest
    }
    next();
});