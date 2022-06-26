import express, { Request, Response, NextFunction } from 'express';
import { handleResponse } from '..';
import Validator from '../../helpers/validator';
import MovieDetailsController from './controller';
import MovieDetailsService from './service';
import OMDBService from '../omdb/service';
import MovieDetailsDal from './dal';
import { validateMonthlyLimit } from './middleware';
const router = express.Router();


const service = new MovieDetailsService(new OMDBService, new MovieDetailsDal);
const validator = new Validator();

router.post('/', validateMonthlyLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body, req.query);
    const controller = new MovieDetailsController(service, validator);
    req.body.user_id = req.query.user_id;
    return handleResponse(await controller.createMovie(req.body), res);
  } catch (error) {
    next(error);
  }
});

export default router;
