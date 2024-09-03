import app from './app';
import mongoose from 'mongoose';
import cluster from 'cluster';
import os from 'os';

// Load environment variables
const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing server gracefully...`);
  
    server.close(async () => {
      console.log('Closed out remaining connections.');
  
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error while closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  
    // Forcefully shut down after a timeout
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000); // 10 seconds
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
      process.exit(1);
    });
  });

  // Catch uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
      process.exit(1);
    });
  });
}