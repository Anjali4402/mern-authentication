import ErrorHandler from '../middlewares/error.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { User } from '../models/userModel.js';


export const register = catchAsyncError(async (req, res, next) => {
    try {
        // get Details for the api request
        const { name, email, phone, password, verificationMethod } = req.body;

        // Throw error if any field is missing.
        if (!name || !email || !phone || !password || !verificationMethod) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        // create function that check country code (only for india) and phone number digit is 10.
        function validatePhoneNumber(phone) {
            const phoneRegex = /^+91\d(10)$/;
            return phoneRegex.test(phone);
        }

        // Throw error if phone number is invalid
        if (!validatePhoneNumber(phone)) {
            return next(new ErrorHandler("Invalid phone number.", 400));
        }

        // Check existing user from the database.
        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true
                },
                {
                    phone,
                    accountVerified: true
                },
            ],
        });


        // if User already then Throw error
        if (existingUser) {
            return next(new ErrorHandler("Phone or Email is already used.", 400))
        };


        // check if user attempts for signup
        const registerationAttemptsByUser = await User.find({
            $or: [
                { phone, accountVerified: false },
                { email, accountVerified: false }
            ]
        });

        // Throw  error if Number of atttmpts are greater then 3
        if (registerationAttemptsByUser.length > 3) {
            return next(new ErrorHandler("You have exceeded the maximum number of attempts (3). Please try again after an hour.", 400))
        }


        // Store these information of user in database.
        const userData = {
            name, email, phone, password
        };

        // Create user.
        const user = await User.create(userData);

        // store verification code.
        const verificationCode = await user.generateVerificationCode();

        // and save user
        await user.save();

        // Function that send the verification code.
        sendVerificationCode(verificationMethod, verificationCode, email, phone);

        // send success response.
        res.status(200).json({
            success: true,
        });

    } catch (error) {
        next(error)
    }
})