import { InAppResponse } from "../helpers/response"

export interface MovieRepo {
    fetchAdditionalInfo(movie_title: string): Promise<InAppResponse>
}

export interface MovieInfo {
    Title: string
    Released: string
    Genre: string
    Director: string
  }

  