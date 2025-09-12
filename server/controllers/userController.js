import ErrorHandler from '../middlewares/error.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { User } from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import twilio from 'twilio';
import { sendToken } from '../utils/sendToken.js';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


export const register = catchAsyncError(async (req, res, next) => {
    try {
        // get Details for the api request
        const { name, email, phone, password, verificationMethod } = req.body || {};

        // Throw error if any field is missing.
        if (!name || !email || !phone || !password || !verificationMethod) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        // create function that check country code (only for india) and phone number digit is 10.
        function validatePhoneNumber(phone) {
            const phoneRegex = /^\+91\d{10}$/;
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
        sendVerificationCode(verificationMethod, verificationCode, email, phone, name, res);


    } catch (error) {
        return next(error)
    }
});


// create function for send verification code.
// like when we share the code /otp in email or phone etc..
async function sendVerificationCode(verificationMethod, verificationCode, email, phone, name, res) {


    try {

        if (verificationMethod === 'email') {
            const message = generateEmailTemplete(verificationCode);

            // the will send the email code in user email.
            sendEmail({ email, subject: "Your Verifciation Code", message })


            // send success response.
            res.status(200).json({
                success: true,
                message : `Verification email successfully sent to ${name}`
            });

            // if verification method is phone
        } else if (verificationMethod === 'phone') {

            // we will get code ---> 45678
            // convert this value ---> 4 5 6 7 8
            const verificationCodeWithSpace = verificationCode
                .toString()
                .split("")
                .join(" ");


            // send message on phone
            await client.calls.create({
                // twiml is twilio markup language.
                twiml: `<Response><Say>Your verification code is${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace} </Say></Response>`,
                from: process.env.TWILIO_PHONE, // The number to call from 
                to: phone, // The number to call
            });


            // send success response.
            res.status(200).json({
                success: true,
                message : "OTP sent"
            });
        } else {
            // throw new ErrorHandler("Invalid verification method.", 500);
            // send success response.
        return res.status(500).json({
            success: false,
            message: "Invalid verification method"
        });
        }
    } catch (error) {

        // new ErrorHandler("Failed to send verification code.", 500)
        return  res.status(500).json({
            success: false,
            message: "Verification code failed to send."
        });

    }
}

// Email templete for verification code.
function generateEmailTemplete(verificationCode) {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; 
              border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
    
    <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
    
    <p style="font-size: 16px; color: #333;">Dear User,</p>
    <p style="font-size: 16px; color: #333;">Your verification code is:</p>
    
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; 
                   padding: 12px 24px; border: 1px solid #4CAF50; border-radius: 6px;">
        ${verificationCode}
      </span>
    </div>
    
    <p style="font-size: 16px; color: #333;">
      Please use this code to verify your email address. The code will expire in 10 minutes.
    </p>
    
    <p style="font-size: 16px; color: #333;">
      If you did not request this, please ignore this email.
    </p>
    
    <p style="font-size: 16px; color: #333;">Thank you,<br>Your Company Team</p>
    
    <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #888;">
      This is an automated message. Please do not reply to this email.
    </footer>
  </div>
  `;
};





// Create API Method of verify otp.
export const verifyOTP = catchAsyncError(async (req, res, next) => {

    // get value form the request's body
    const {email, otp, phone } = req.body || {};

    if(!email || !otp || !phone){
        return next(new ErrorHandler("All Fields are required."))
    }

    // create function that check country code (only for india) and phone number digit is 10.
        function validatePhoneNumber(phone) {
            const phoneRegex = /^\+91\d{10}$/;
            return phoneRegex.test(phone);
        }


        // Check if mobile number is not valid. throw error.
        if(!validatePhoneNumber(phone)){
            return next(new ErrorHandler("Invalid phone number.", 400));
        };

        try{
            // get all entires of the same user ( same email or phone );
            // and sort them in decending order like the latest new will be in the starting.
            const userAllEntries = await User.find({
                $or : [
                    { email , accountVerified: false },
                    { phone , accountVerified: false }
                ]
            }).sort({ createdAt : -1 });

            // If there is not any entires from that user. throw error.
            if(!userAllEntries.length > 0){
                return next(new ErrorHandler("User not found.", 400))
            };

            // store single user entry.
            let user;

            // If same user entry is more then 1.
            if(userAllEntries.length > 1) {
                
                // because the data is sorted then the latest user entry will at the starting.
                user = userAllEntries[0];

                // Delete other Entries
                await User.deleteMany({
                    _id : { $ne : user._id }, // not remove that user which id is user._id
                    $or : [
                        { phone, accountVerified : false },
                        { email, accountVerified : false }
                    ],
                });
            } else {
                user = userAllEntries[0];
            };

            
            // if verification code (stored in db) and otp (sent by user) not matched.
            if(user.verificationCode !== Number(otp)){
                return next(new ErrorHandler("Invalid OTP.", 400));
            }


            // get current time
            const currentTime = Date.now();

            // get code expire time and change that formate
            const verificationCodeExpire = new Date(
                user.verificationCodeExpire
            ).getTime();
            console.log(currentTime);
            console.log(verificationCodeExpire);


            // check if current time is above the token expiration time.
            // then throw "Token expired" error.
            if(currentTime > verificationCodeExpire){
                return next(new ErrorHandler("OTP Expired", 400));
            }

            // if Everything is fine till now

            // change these value.
            user.accountVerified = true;
            user.verificationCode = null;
            user.verificationCodeExpire = null;

            // set/update these value in the database user collection.
            await user.save({ validateModifiedOnly : true}); // validateModifiedOnly --> check only those type which values we are changing.


            // If use successfull verify then 
            // send token to the cookies. 
            sendToken(user, 200, "Account Verified", res);

        } catch(error){

            return next(new ErrorHandler("Internal Server Error.", 500))

        }

});




// Create API Method for login
export const login = catchAsyncError(async (req, res, next) => {

    // get email and password from the request 
        const {email, password } = req.body || {}; // req?.body;
    
    // check if we are getting email and password both.
    if(!email || !password){
        return next(new ErrorHandler("Email and password are required", 400));
    };

    

    // Find the user which match with this email and password.
    const user = await User.findOne({email, accountVerified : true}).select(
        "+password"
    );


    // If no user found
    if(!user){
        return next(new ErrorHandler("Invalid Email and password", 400))
    };

    // now try to match the password
    const isPasswordMatched = await user.comparePassword(password);

    console.log(isPasswordMatched);
    // if not password matched
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password.", 400));
    }
    

    // after successfully login send token.
    sendToken(user, 200, "User logged in successfully.", res);
});




// Create API method for logout
export const logout = catchAsyncError(async (req, res, next) => {
    
    // for logout user , clear the token from cookies

    res
    .status(200)
    .cookie("token", "", {
        expires : new Date(Date.now()),
        httpOnly : true,
    })
    .json({
        success : true,
        message : "Logged out successfully.",
    });
});




// Create API form get user.
export const getUser = catchAsyncError(async (req, res, next) => {
    
    const user = req.user; // this will that user what we matched with cookies.
    res.status(200).json({
        status : true,
         user,
    })
});





// Create Forgot password API.
// In the code we will generate the token and send the complete fronend url in the mail 
// Emaple: send mail is like "http://localhost:5173/password/reset/10996fa5443449e661ef90daf7f9d45b5c94fd46"
export const forgotPassword = catchAsyncError(async (req, res, next) => {


    // get Email from the requiest
    const { email } = req.body || {};


    if(!email){
        return next(new ErrorHandler("Email is required", 400));
    };


    // Find that user from the given email.
    const user = await User.findOne({
        email,
        accountVerified : true
    });

    
    // if User not available
    if(!user){
        return next(new ErrorHandler("No user Found!", 404))
    };
    
    // get new reset token
    const resetToken = user.generateResetPasswordToken();
    

    // save user
    await user.save({ validateBeforeSave : false })  //validate before check false will not check all user type values

    // create a url added with reset token 
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    // Write/ create complete message 
    const message = `Your Reset Password Token is: \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

    try{
        // send mail throw mail
        sendEmail({
            email : user.email,
            subject : "MERN AUTHENTICATION APP RESET PASSWORD",
            message,
        });

        // show success messge.
        res.status(200).json({
            success : true,
            message : `Email sent to ${user.email} successfully.`
        });
    }catch(error){
        // if any resion can't send the message then clear these values 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave : false });

        // send error message.
        return next(
            new ErrorHandler(
                error.message ? error.message : "Cannot send reset password token."
            )
        )
    }


    return res.status(200).json({
        success : true,
        data : 'we got the data'
    })


})
