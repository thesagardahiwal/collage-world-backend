import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import connectDB from './config/db';

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

import followRoutes from './routes/followRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';
import saveRoutes from './routes/saveRoutes';
import postRoutes from './routes/postRoutes';
import reelRoutes from './routes/reelRoutes';

import subjectRoutes from './routes/subjectRoutes';
import resourceRoutes from './routes/resourceRoutes';
import educationRoutes from './routes/educationRoutes';
import eduResourceRoutes from './routes/eduResourceRoutes';  // Import resource routes

import noteRoutes from "./routes/noteRoutes";
import tipTrickRoutes from "./routes/tipTrickRoutes";
import newsRoutes from "./routes/newsRoutes";
import doubtRoutes from "./routes/doubtRoutes";
import answerRoutes from "./routes/answerRoutes";

import http from 'http';
import { setupSocketIO } from './sockets/socket';
import errorHandler from './middlewares/errorHandler';

const app = express();
const server = http.createServer(app);
app.use(express.json());


app.use(cors({
    origin: process.env.CLIENT_URL,  // Allow requests only from the frontend URL
    credentials: true,  // Allow cookies to be sent with requests
  }));

connectDB();
app.use('/api/auth', authRoutes); // Authentication
app.use('/api/user', userRoutes); // User profile management
app.use('/api/follow', followRoutes); // Follow/unfollow
app.use('/api/comment', commentRoutes); // Comments
app.use('/api/like', likeRoutes); // Likes
app.use('/api/save', saveRoutes); // Saved posts
app.use('/api/subject', subjectRoutes); // Subjects
app.use('/api/resource', resourceRoutes); // General resources
app.use('/api/reels', reelRoutes); // Reels content
app.use('/api/education', educationRoutes); // Education
app.use('/api/posts', postRoutes); // Posts
app.use('/api/eduResources', eduResourceRoutes); // Educational resources
app.use('/api/doubts', doubtRoutes); // Doubt discussions
app.use('/api/answers', answerRoutes); // Answers to doubts
app.use('/api/news', newsRoutes); // News updates
app.use('/api/tiptricks', tipTrickRoutes); // Tips & Tricks
app.use('/api/notes', noteRoutes); // Study notes

app.use(errorHandler);
setupSocketIO(server);

export default app