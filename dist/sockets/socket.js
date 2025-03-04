"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log('A user connected');
        // Add more socket event handlers as needed
    });
};
exports.setupSocketIO = setupSocketIO;
