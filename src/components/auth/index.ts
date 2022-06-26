import express, { Request, Response, NextFunction } from 'express';
import { handleResponse } from '..';
import Validator from '../../helpers/validator';
import AuthController from './controller';
import AuthService from './service';

const router = express.Router();

const service = new AuthService();
const validator = new Validator();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new AuthController(service, validator);
    return handleResponse(controller.authenticate(req.body), res);
  } catch (error) {
    next(error);
  }
});

export default router;
