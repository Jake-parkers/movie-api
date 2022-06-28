import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import router from './components';
import { CommonErrors } from './error-handling/common-errors';
import { HttpStatusCode } from './helpers/httpStatusCodes';
import ErrorHandler from './error-handling/error-handler';
import AppException from './error-handling/base';
import Logger from './helpers/logger';
import initiateMongodb from './database/mongodb';
import { dbConnect } from './database/inmemorydb';

const errorHandler = new ErrorHandler(Logger);

if (process.env.NODE_ENV === 'test') {
  dbConnect()
} else {
  initiateMongodb();
}

const app: Express = express();

app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));
else app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  bodyParser.json()(req, res, (err) => {
    if (err) {
      const error = new AppException(
        CommonErrors.INVALID_JSON_PAYLOAD,
        { message: 'An invalid JSON payload was sent', context: req.body },
        true,
        HttpStatusCode.BAD_REQUEST,
      );
      (async function () {
        await errorHandler.handleError(error, res);
      })();
      return;
    }
    next();
  });
});

app.use(router);

/**
 * Error handling middleware: all errors will be handled here as they fall through from whatever router
 */
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  await errorHandler.handleError(err, res);
  next();
});

export default app;
