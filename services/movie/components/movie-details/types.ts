import { InAppResponse } from "../../helpers/response";
import { MovieInfo } from "../types";
import { Movie } from "./models/movie";

export interface MovieDetails {
  save(title: string): Promise<InAppResponse>;
}

export interface MovieDal {
  save(movie_info: MovieInfo): Promise<Movie>
}