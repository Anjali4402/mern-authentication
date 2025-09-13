
import express from 'express';
import { forgotPassword, getUser, login, logout, register, resetPassword, verifyOTP } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

// create router instance 
const router = express.Router();

// Register Route
router.post("/register", register);

// OTP Verification route.
router.post("/otp-verification", verifyOTP);

// Login route.
router.post("/login", login);

// Logout route.
router.get("/logout", isAuthenticated, logout);

// Get user
router.get('/me', isAuthenticated, getUser) // means in this router user send request for this user.  

// forgot password
router.post("/password/forgot", forgotPassword);

// reset password
router.put("/password/reset/:token", resetPassword);


export default router;
