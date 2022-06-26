import BadRequestException from '../../error-handling/bad-request-exception';
import InvalidParamsException from '../../error-handling/invalid-params-exception';
import ObjectExistsException from '../../error-handling/object-exists-exception';
import { validate } from '../../helpers/misc';
import { SuccessResponse } from '../../helpers/response';
import { CustomValidator } from '../../helpers/validator';
import { MovieDetails } from './types';
import { CREATE_MOVIE_SCHEMA } from './validation-schema';

class MovieDetailsController {
  private MovieDetailsService: MovieDetails;
  private Validator: CustomValidator;
  constructor(movie_details_service: MovieDetails, validator: CustomValidator) {
    this.MovieDetailsService = movie_details_service ;
    this.Validator = validator;
  }

  async createMovie(data: { title: string }) {
    try {
      const result = validate(data, this.Validator, CREATE_MOVIE_SCHEMA)
      data = result.data;
      const resp = await this.MovieDetailsService.save(data.title);
      return new SuccessResponse(resp.data, 'Movie Created Successfully');
    } catch (error) {
      if (error instanceof InvalidParamsException) {
        throw new BadRequestException({ message: error.description, error_info: {error: "invalid_movie_title", error_description: ""} });
      }
      if (error instanceof ObjectExistsException) {
        throw new BadRequestException({ message: error.description, error_info: {error: "duplicate_movie_title", error_description: ""} });
      }
      throw error;
    }
  }
}

export default MovieDetailsController;
