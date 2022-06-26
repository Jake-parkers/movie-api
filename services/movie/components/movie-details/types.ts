import { InAppResponse } from "../../helpers/response";
import { MovieInfo } from "../types";
import { Movie } from "./models/movie";

export interface MovieDetails {
  save(title: string, user_id: string): Promise<InAppResponse>;
}

export interface MovieDal {
  save(movie_info: MovieInfo): Promise<Movie>

  incrementCounter(user_id: string): Promise<void>

  getCounter(user_id: string): Promise<number | null>

  getMostRecentCreationDate(user_id: string): Promise<string | null>

  resetCounter(user_id: string): Promise<void>
}

export enum USERROLES {
  BASIC = "basic",
  PREMIUM = "premium"
}