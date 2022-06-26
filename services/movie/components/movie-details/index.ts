import express, { Request, Response, NextFunction } from 'express';
import { handleResponse } from '..';
import Validator from '../../helpers/validator';
import MovieDetailsController from './controller';
import MovieDetailsService from './service';
import OMDBService from '../omdb/service';
import MovieDetailsDal from './dal';
const router = express.Router();


const service = new MovieDetailsService(new OMDBService, new MovieDetailsDal);
const validator = new Validator();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new MovieDetailsController(service, validator);
    return handleResponse(await controller.createMovie(req.body), res);
  } catch (error) {
    next(error);
  }
});

export default router;
