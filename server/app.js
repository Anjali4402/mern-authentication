// Import all the required dependencies
import express from 'express';       // Web framework for Node.js (used to build APIs)
import { config } from 'dotenv';     // To load environment variables from a file
import cookieParser from 'cookie-parser'; // To read cookies from requests
import cors from 'cors';             // To allow frontend and backend to talk to each other (cross-origin requests)
import { connection } from './database/dbConnection.js';  // add Database connection

// Create an Express app (this will be our backend server)
export const app = express();

// Load environment variables from the config.env file
config({ path: "./config.env" });

// Middlewares (functions that run before your routes)

// Enable CORS (Cross-Origin Resource Sharing)
// This allows your frontend (React) to send requests to your backend
app.use(cors({
    origin: [process.env.FRONTEND_URL],  // Only allow requests from your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true,  // Allow cookies and authentication data to be sent
}));

// Parse cookies so we can access them easily in our routes
app.use(cookieParser());

// Parse incoming JSON requests (so we can access req.body in JSON format)
app.use(express.json());

// Parse URL-encoded data (like form submissions)
// like it will know what type of data user have send from the Frontend
app.use(express.urlencoded({ extended: true }));


connection();
