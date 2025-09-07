
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        minLength: [8, "Password must have at least 8 characters."],
        maxLength: [32, "Password cannot have more then 32 characters."],
    },
    phone: String,
    accountVerified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// it will run before the schema check // directly first run this one.
// we are hashing the password , and making it strong
userSchema.pre('save', async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});


// It will run when we login  like
// It will compare the current entered password to the already increpted password .
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt(enteredPassword, this.password);
};


// Create funciton to generate verification code 
userSchema.methods.generateVerificationCode = function () {
    function generateRandomFiveDigitNumber() {

        // set first digit which is in between 1 to 9 
        const firstDigit = Math.floor(Math.random() * 9) + 1;

        // for remain digit need to 4 digit ( can be any)
        const remainingDigits = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, 0);

        // concatenate the first and remain digit and return them 
        return parseInt(firstDigit + remainingDigits);
    }

    // call the function and set the value
    const verificationCode = generateRandomFiveDigitNumber();

    // set verification code value in verification code 
    this.verificationCode = verificationCode;
    // set the value of verification code expire 
    this.verificationCodeExpire = Date.now() + 5 * 60 * 1000;

    return verificationCode;
};



userSchema.methods.generateToken = function(){
    //  we can generate token using sign method
    return jwt.sign(
        {id : this._id}, // in jwt we have to store a unique identity of that user. in this case we have generated mongodb id
        process.env.JWT_SECRET_KEY,  // secreate key to match token
        {expiresIn: process.env.JWT_EXPIRE // expiration time

 } )

}




export const User = mongoose.model('User', userSchema);