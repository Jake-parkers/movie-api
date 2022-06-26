import { MovieInfo } from "../types";
import MovieModel, { Movie } from "./models/movie";
import { MovieDal } from "./types";
import RedisClient from '../../database/redis';

class MovieDetailsDal implements MovieDal {
    async save(movie_info: MovieInfo): Promise<Movie> {
        const movie = new MovieModel(movie_info);;
        return await movie.save();
    }

    async incrementCounter(user_id: string): Promise<void> {
        await RedisClient.multi()
            .set(user_id, new Date().toISOString())
            .incr(`${user_id}_counter`)
        .exec()
    }

    async getCounter(user_id: string): Promise<number | null> {
        const count =  await RedisClient.get(`${user_id}_counter`);
        if (count) return parseInt(count);
        return null;
    }

    async resetCounter(user_id: string): Promise<void> {
        await RedisClient.set(`${user_id}_counter`, "0");
    }

    async getMostRecentCreationDate(user_id: string): Promise<string | null> {
        return await RedisClient.get(user_id);
    }
}

export default MovieDetailsDal;

// 5 requests per month for creation
// what happens if they don't use up their kini and the month runs out
// when req comes
// if basic
// get diff between last date and today
// if diff is 0
// if count is more than 5, throw error
// else allow it to pass
// if diff is more than 0
// reset the counter to 0
// allow it to pass