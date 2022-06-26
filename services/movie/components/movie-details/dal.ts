import { MovieInfo } from "../types";
import MovieModel, { Movie } from "./models/movie";
import { MovieDal } from "./types";

class MovieDetailsDal implements MovieDal {
    async save(movie_info: MovieInfo): Promise<Movie> {
        const movie = new MovieModel(movie_info);;
        return await movie.save();
    }
}

export default MovieDetailsDal;