import InvalidParamsException from '../../error-handling/invalid-params-exception';
import ObjectExistsException from '../../error-handling/object-exists-exception';
import { buildInAppSucess, InAppResponse, Status } from '../../helpers/response';
import { MovieDal, MovieDetails } from './types';
import { differenceInCalendarMonths } from "date-fns"
import { Movie } from './models/movie';
import { MovieRepo } from '../types';
class MovieDetailsService implements MovieDetails {
  private MovieRepo: MovieRepo;
  private MovieDal: MovieDal;
  readonly MAX_BASIC_USERS_LIMIT = 5;
  constructor(movie_repo: MovieRepo, movie_dal: MovieDal) {
    this.MovieRepo = movie_repo;
    this.MovieDal = movie_dal;
  }

  async save(title: string, user_id: string): Promise<InAppResponse> {
    try {
      const response = await this.MovieRepo.fetchAdditionalInfo(title);
      await this.MovieDal.incrementCounter(user_id)
      if (response.status === Status.ERROR) throw new InvalidParamsException("Movie Title is invalid");
      const movie: Movie = response.data;
      if (!movie.Released) movie.Released = "N/A" 
      if (movie.Released !== "N/A") movie.Released = new Date(movie.Released).toISOString();
      movie.User_id = user_id;
      await this.MovieDal.save(movie);    
      return response;
    } catch (error: any) {
      if (error.code === 11000) throw new ObjectExistsException("Movie Title exists already");
      throw error;
    }
    
  }

  async get(user_id: string) {
    let movies: Movie[] = []
    const result = await this.MovieDal.get(user_id);
    if (result) movies = result;
    return buildInAppSucess(movies);
  }

  async validateLimit(user_id: string) {
    const today = new Date();
    const last_creation_date = await this.MovieDal.getMostRecentCreationDate(user_id);
    if (!last_creation_date) {
      // first time
      return true;
    }
    const diff = differenceInCalendarMonths(today, new Date(last_creation_date));
    if (diff < 1) { 
      // still in the same month
      const count = await this.MovieDal.getCounter(user_id);
      if (count === this.MAX_BASIC_USERS_LIMIT) return false;
      return true;
    } else {
      // we're in a new month. reset the count
      await this.MovieDal.resetCounter(user_id);
      return true;
    }
  }
}

export default MovieDetailsService;
