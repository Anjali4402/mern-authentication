
import express from 'express';
import { register } from '../controllers/userController.js';

// create router instance 
const router = express.Router();

router.post("/register", register);

export default router;
