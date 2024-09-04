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
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', followRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api', saveRoutes);
app.use('/api', subjectRoutes);
app.use('/api', resourceRoutes);
app.use('/api', educationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/eduResources', eduResourceRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tiptricks', tipTrickRoutes);
app.use('/api', noteRoutes);

app.use(errorHandler);
setupSocketIO(server);

export default app