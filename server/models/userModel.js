
import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : {
        type : String,
        minLength : [8, "Password must have at least 8 characters."],
        maxLength : [32, "Password cannot have more then 32 characters."],
    },
    phone : String,
    accountVerified : { type : Boolean, default : false },
    verificationCode : Number,
    verificationCodeExpire : Date,
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now,
    },
});


// it will run before the schema check // directly first run this one.
// we are hashing the password , and making it strong
userSchema.pre('save', async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});


// It will run when we login  like
// It will compare the current entered password to the already increpted password .
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt(enteredPassword, this.password);
};


export const User = mongoose.model('User', userSchema);