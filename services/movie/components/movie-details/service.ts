import InvalidParamsException from '../../error-handling/invalid-params-exception';
import ObjectExistsException from '../../error-handling/object-exists-exception';
import { InAppResponse, Status } from '../../helpers/response';
import { MovieInfo, MovieRepo } from '../types';
import { MovieDal, MovieDetails } from './types';
import { differenceInCalendarMonths } from "date-fns"
class MovieDetailsService implements MovieDetails {
  private MovieRepo: MovieRepo;
  private MovieDal: MovieDal;
  readonly MAX_BASIC_USERS_LIMIT = 5;
  constructor(movie_repo: MovieRepo, movie_dal: MovieDal) {
    this.MovieRepo = movie_repo;
    this.MovieDal = movie_dal;
  }

  async save(title: string, username: string): Promise<InAppResponse> {
    try {
      const response = await this.MovieRepo.fetchAdditionalInfo(title);
      if (response.status === Status.ERROR) throw new InvalidParamsException("Movie Title is invalid");
      const movie: MovieInfo = response.data;
      movie.Released = new Date(movie.Released);
      await Promise.all([
        this.MovieDal.save(movie),
        this.MovieDal.incrementCounter(username)
      ])
      return response;
    } catch (error: any) {
      if (error.code === 11000) throw new ObjectExistsException("Movie Title exists already");
      throw error;
    }
    
  }

  async validateLimit(username: string) {
    const today = new Date();
    const last_creation_date = await this.MovieDal.getMostRecentCreationDate(username);
    if (!last_creation_date) {
      // first time
      return true;
    }
    const diff = differenceInCalendarMonths(today, new Date(last_creation_date));
    if (diff < 1) { 
      // still in the same month
      const count = await this.MovieDal.getCounter(username);
      if (count === this.MAX_BASIC_USERS_LIMIT) return false;
      return true;
    } else {
      // we're in a new month. reset the count
      await this.MovieDal.resetCounter(username);
      return true;
    }
  }
}

export default MovieDetailsService;
