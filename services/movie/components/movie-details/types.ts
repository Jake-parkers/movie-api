import { InAppResponse } from "../../helpers/response";
import { MovieInfo } from "../types";
import { Movie } from "./models/movie";

export interface MovieDetails {
  save(title: string, username: string): Promise<InAppResponse>;
}

export interface MovieDal {
  save(movie_info: MovieInfo): Promise<Movie>

  incrementCounter(username: string): Promise<void>

  getCounter(username: string): Promise<number | null>

  getMostRecentCreationDate(username: string): Promise<string | null>

  resetCounter(username: string): Promise<void>
}

export enum USERROLES {
  BASIC = "basic",
  PREMIUM = "premium"
}