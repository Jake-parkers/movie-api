import { ErrorNames } from "../../error-handling/common-errors";
import { makeRequest } from "../../helpers/make-request";
import { buildInAppError, buildInAppSucess, InAppResponse } from "../../helpers/response";
import { MovieRepo } from "../types";

class OMDBService implements MovieRepo {
    async fetchAdditionalInfo(movie_title: string): Promise<InAppResponse> {
        try {
            const response = await makeRequest({
                url: `${process.env.OMDB_BASE_URL}/?t=${movie_title}&apikey=${process.env.OMDB_API_KEY}`,
                method: "get",
            });
            const { Response } = response.data;
            if (Response === 'True') {
                const { Title, Released, Genre, Director } = response.data;
                return buildInAppSucess({ Title, Released, Genre, Director })
            }
            return buildInAppError(ErrorNames.NOT_FOUND_ERROR)
        } catch (error) {
            console.error("Movie Fetch Error: ", error);
            throw error;
        }
    }
}

export default OMDBService