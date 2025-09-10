
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";


// This function will check is User authenticated (already Created or login)
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    
    // Get token from the cookies
    const { token } = req.cookies;

    // // if no token available.
    if(!token){
        return next(new ErrorHandler("User is not Authenticated", 400));
    };

    // First it will check is this token is share by out website (match it with the JWT secreate key);
    // if matched then return the user id ( what we added in "generateToken" method )
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // if this id with match the userId (stored in mongodb)
    req.user = await User.findById(decoded.id);

    // if everything works then move out from the function sucessfully.
    next();
})