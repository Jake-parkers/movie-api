import dotenv from 'dotenv';
dotenv.config();

import app from '.';
import Logger from './helpers/logger';
import ErrorHandler from './error-handling/error-handler';
import http from 'http';

const errorHandler = new ErrorHandler(Logger);

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var. Set it and restart the server');
}

const closeOpenConnections = () => {
  Logger.info('Shutting down server and open connections', new Date().toJSON());
  server.close(() => {
    Logger.info('Server shut down', new Date().toJSON());
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
      closeOpenConnections();
    }, 5000);
  }
});

/**
 * Close connections when SIGTERM interupt is received
 */
process.on('SIGTERM', () => {
  closeOpenConnections();
});

/**
 * Close connections when SIGINT interupt is received
 */
process.on('SIGINT', () => {
  closeOpenConnections();
});
