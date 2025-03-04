"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const saveRoutes_1 = __importDefault(require("./routes/saveRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const reelRoutes_1 = __importDefault(require("./routes/reelRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const educationRoutes_1 = __importDefault(require("./routes/educationRoutes"));
const eduResourceRoutes_1 = __importDefault(require("./routes/eduResourceRoutes")); // Import resource routes
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const tipTrickRoutes_1 = __importDefault(require("./routes/tipTrickRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const doubtRoutes_1 = __importDefault(require("./routes/doubtRoutes"));
const answerRoutes_1 = __importDefault(require("./routes/answerRoutes"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./sockets/socket");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL, // Allow requests only from the frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));
(0, db_1.default)();
app.use('/api/auth', authRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api', followRoutes_1.default);
app.use('/api', commentRoutes_1.default);
app.use('/api', likeRoutes_1.default);
app.use('/api', saveRoutes_1.default);
app.use('/api', subjectRoutes_1.default);
app.use('/api/resource', resourceRoutes_1.default);
app.use('/api/reels', reelRoutes_1.default);
app.use('/api', educationRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/eduResources', eduResourceRoutes_1.default);
app.use('/api/doubts', doubtRoutes_1.default);
app.use('/api/answers', answerRoutes_1.default);
app.use('/api/news', newsRoutes_1.default);
app.use('/api/tiptricks', tipTrickRoutes_1.default);
app.use('/api', noteRoutes_1.default);
app.use(errorHandler_1.default);
(0, socket_1.setupSocketIO)(server);
exports.default = app;
