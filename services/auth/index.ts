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
import proxy from "express-http-proxy";
import { validateUserToken } from './components/authentication/middleware';
// import querystring from "querystring";
// import { UserAccessTokenPayload } from './components/authentication/types';

const errorHandler = new ErrorHandler(Logger);

const app: Express = express();

app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny'));
else app.use(morgan('combined'));


app.post('/movies', validateUserToken, proxy(process.env.MOVIE_API_URL, {
  proxyReqPathResolver: function (req) {
    console.log("url:", req.url, req.query);
    const { role, user_id } = req.query;
    const parts = req.url.split('?');
    return  parts[0] + `?role=${role}&user_id=${user_id}`;
  },
  userResDecorator: function(proxyRes, proxyResData) {
   console.log("RES: ",proxyResData.toString('utf-8'));
   return JSON.stringify(JSON.parse(proxyResData.toString('utf-8')));
  },
  proxyErrorHandler: function(err, res, next) {
    next(err);
  }
}));

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
