import InvalidParamsException from '../../error-handling/invalid-params-exception';
import { InAppResponse, Status } from '../../helpers/response';
import { MovieRepo } from '../types';
import { MovieDetails } from './types';

class MovieDetailsService implements MovieDetails {
  private MovieRepo: MovieRepo;

  constructor(movie_repo: MovieRepo) {
    this.MovieRepo = movie_repo;
  }

  async save(title: string): Promise<InAppResponse> {
    try {
      const response = await this.MovieRepo.fetchAdditionalInfo(title);
      if (response.status === Status.ERROR) throw new InvalidParamsException("Movie Title is invalid");
      return response;
    } catch (error) {
      console.error("Hee: ", error);
      throw error;
    }
    
  }

  // private async fetchDetails(title: string) {
  // }
}

export default MovieDetailsService;
