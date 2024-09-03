import { Server } from 'socket.io';

export const setupSocketIO = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    // Add more socket event handlers as needed
  });
};
