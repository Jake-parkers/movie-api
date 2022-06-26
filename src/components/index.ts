import express, { Response, Request } from 'express';
import { AppResponse, SuccessResponse, ErrorResponse } from '../helpers/response';
import { HttpStatusCode } from '../helpers/httpStatusCodes';
import { stripEmptyProperties } from '../helpers/misc';
import AppException from '../error-handling/base';
import auth from './auth';

const router = express.Router();

const BASE_ROUTE_MESSAGE = '';

export const handleResponse = function (response: AppException | AppResponse, res: Response) {
  let resp = Object.assign({}, response);
  if (response instanceof AppException) {
    resp = new ErrorResponse(
      response.message || response.data.error_info?.error_description || '',
      response.data.error_info,
    );
  }
  if (response instanceof SuccessResponse) delete resp.httpCode;
  res.status(response.httpCode as number).json(stripEmptyProperties(resp));
};

router.get('/', (req: Request, res: Response) => {
  return handleResponse(new SuccessResponse({}, BASE_ROUTE_MESSAGE, HttpStatusCode.OK), res);
});

router.use('/auth', auth);
export default router;
