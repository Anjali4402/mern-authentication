
import express from 'express';
import { login, register, verifyOTP } from '../controllers/userController.js';

// create router instance 
const router = express.Router();

// Register Route
router.post("/register", register);

// OTP Verification route.
router.post("/otp-verification", verifyOTP);

// Login route.
router.post("/login", login);




export default router;
