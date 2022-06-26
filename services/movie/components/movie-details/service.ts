import InvalidParamsException from '../../error-handling/invalid-params-exception';
import ObjectExistsException from '../../error-handling/object-exists-exception';
import { InAppResponse, Status } from '../../helpers/response';
import { MovieInfo, MovieRepo } from '../types';
import { MovieDal, MovieDetails } from './types';

class MovieDetailsService implements MovieDetails {
  private MovieRepo: MovieRepo;
  private MovieDal: MovieDal
  constructor(movie_repo: MovieRepo, movie_dal: MovieDal) {
    this.MovieRepo = movie_repo;
    this.MovieDal = movie_dal;
  }

  async save(title: string): Promise<InAppResponse> {
    try {
      const response = await this.MovieRepo.fetchAdditionalInfo(title);
      if (response.status === Status.ERROR) throw new InvalidParamsException("Movie Title is invalid");
      const movie: MovieInfo = response.data;
      movie.Released = new Date(movie.Released);
      await this.MovieDal.save(movie);
      return response;
    } catch (error: any) {
      if (error.code === 11000) throw new ObjectExistsException("Movie Title exists already");
      throw error;
    }
    
  }

  // private async fetchDetails(title: string) {
  // }
}

export default MovieDetailsService;
