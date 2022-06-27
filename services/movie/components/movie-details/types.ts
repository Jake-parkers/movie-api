import { InAppResponse } from "../../helpers/response";
import { Movie } from "./models/movie";

export interface MovieDetails {
  save(title: string, user_id: string): Promise<InAppResponse>;

  get(user_id: string): Promise<InAppResponse>;
}

export interface MovieDal {
  save(movie_info: Movie): Promise<Movie>

  get(user_id: string): Promise<Movie[] | null>

  find(movie_title: string, user_id: string): Promise<Movie | null>

  incrementCounter(user_id: string): Promise<void>

  getCounter(user_id: string): Promise<number | null>

  getMostRecentCreationDate(user_id: string): Promise<string | null>

  resetCounter(user_id: string, value: number): Promise<void>
}

export enum USERROLES {
  BASIC = "basic",
  PREMIUM = "premium"
}