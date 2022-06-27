// import MovieModel from "../../components/movie-details/models/movie";
import { dummyMovieData, duplicateMovieData, invalidMovieData } from "./data";
import { dbConnect, dbDisconnect } from "../../database/inmemorydb";
// import initiateMongodb from "../../database/mongodb";
import 'mocha'
import { expect } from "chai";
import sinon from "sinon";
import OMDBService from "../../components/omdb/service";
import MovieDetailsService from "../../components/movie-details/service"; 
import MovieDetailsDal from "../../components/movie-details/dal";
import { buildInAppSucess, Status } from "../../helpers/response";
import InvalidParamsException from "../../error-handling/invalid-params-exception";
import MovieModel from "../../components/movie-details/models/movie";
import ObjectExistsException from "../../error-handling/object-exists-exception";

before(async () => {
    await dbConnect();
})

after(async () => {
    await dbDisconnect();
})

describe('Movie Service Tests', function () {
    it ('should save a movie when a valid movie title is provided', async () => {
        const movie_info_stub = sinon.createStubInstance(OMDBService, {
            fetchAdditionalInfo: Promise.resolve(buildInAppSucess(dummyMovieData)) 
        });
        const MDal = new MovieDetailsDal();
        const increment_stub = sinon.stub(MDal, "incrementCounter").callsFake(() => Promise.resolve());
        const movieService = new MovieDetailsService(movie_info_stub, MDal);
        const response = await movieService.save(dummyMovieData.Title, dummyMovieData.User_id);
        expect(response).to.not.be.null;
        expect(response).to.not.be.undefined;
        expect(response.status).to.equal('success');
        expect(response.data).to.have.property('Title');
        expect(response.data).to.have.property('Released');
        expect(response.data).to.have.property('Genre');
        expect(response.data).to.have.property('Director');
        expect(response.data).to.have.property('User_id');
        sinon.assert.calledOnce(increment_stub);
        movie_info_stub.fetchAdditionalInfo.restore();
    })

    it ('should throw an error when an invalid movie title is provided', async () => {
        try {
            const movie_info_stub = sinon.createStubInstance(OMDBService, {
                fetchAdditionalInfo: Promise.resolve({status: Status.ERROR, data: invalidMovieData}) 
            });
            const MDal = new MovieDetailsDal();
            const increment_stub = sinon.stub(MDal, "incrementCounter").callsFake(() => Promise.resolve());
            const movieService = new MovieDetailsService(movie_info_stub, MDal);
            await movieService.save(invalidMovieData.Title, invalidMovieData.User_id)
            sinon.assert.calledOnce(increment_stub);
            movie_info_stub.fetchAdditionalInfo.restore();
        } catch (error: any) {
            expect(error).to.be.instanceOf(InvalidParamsException);
        }
    })

    describe('Duplicate Movie Title', () => {
        before(async () => {
            const new_movie = new MovieModel(duplicateMovieData);
            await new_movie.save();
        })

        it ('should throw an error when a duplicate movie title is provided', async () => {
            try {
                const movie_info_stub = sinon.createStubInstance(OMDBService, {
                    fetchAdditionalInfo: Promise.resolve(buildInAppSucess(duplicateMovieData)) 
                });
                const MDal = new MovieDetailsDal();
                const increment_stub = sinon.stub(MDal, "incrementCounter").callsFake(() => Promise.resolve());
                const movieService = new MovieDetailsService(movie_info_stub, MDal);
                await movieService.save(duplicateMovieData.Title, duplicateMovieData.User_id)
                sinon.assert.calledOnce(increment_stub);
                movie_info_stub.fetchAdditionalInfo.restore();
            } catch (error: any) {
                expect(error).to.be.instanceOf(ObjectExistsException);
            }
        })
    })
})