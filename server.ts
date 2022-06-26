import dotenv from 'dotenv';
dotenv.config();

import app from './src';
import Logger from './src/helpers/logger';
import ErrorHandler from './src/error-handling/error-handler';
import http from 'http';
import mongoose from 'mongoose';

const errorHandler = new ErrorHandler(Logger);

const server = http.createServer(app);

const PORT = process.env.PORT || 9000;

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var. Set it and restart the server');
}

const closeOpenConnections = (errorOccurred: boolean) => {
  Logger.info('Shutting down server and open connections', new Date().toJSON());
  server.close(() => {
    Logger.info('Server shut down', new Date().toJSON());
    mongoose.connection.close(() => {
      Logger.info('Mongoose connection closed', new Date().toJSON());
      process.exit(errorOccurred ? 1 : 0);
    });
  });
};

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/**
 * Catch all unhandled promise rejections here and handle appropriately
 */
process.on('unhandledRejection', (reason) => {
  throw reason;
});

/**
 * Catch all uncaught exceptions that were not handled by the error handling middleware and cleanup appropriately
 */
process.on('uncaughtException', async (error: any) => {
  await errorHandler.logError(error);
  if (!errorHandler.isTrustedError(error)) {
    setTimeout(() => {
      closeOpenConnections(true);
    }, 5000);
  }
});

/**
 * Close connections when SIGTERM interupt is received
 */
process.on('SIGTERM', () => {
  closeOpenConnections(false);
});

/**
 * Close connections when SIGINT interupt is received
 */
process.on('SIGINT', () => {
  closeOpenConnections(false);
});
