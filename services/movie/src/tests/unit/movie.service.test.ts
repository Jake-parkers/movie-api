import 'mocha'
import sinon from "sinon"
import { buildInAppSucess } from '../../helpers/response';
import MovieDetailsService from "../../components/movie-details/service";
import OMDBService from "../../components/omdb/service";
import MovieDetailsDal from "../../components/movie-details/dal";
import Sinon from 'sinon';

const movie = { User_id: "123", "Title":"12 Angry Men","Director":"Sidney Lumet","Genre":"Crime, Drama","Released": "1987-08-15" };

const movies = [ { User_id: "123", "Title":"12 Angry Men","Director":"Sidney Lumet","Genre":"Crime, Drama","Released": "1987-08-15" } ];

describe('Movie Service', () => {
    it ("METHOD save", async () => {
        const movie_info_stub = sinon.createStubInstance(OMDBService, {
            fetchAdditionalInfo: Promise.resolve(buildInAppSucess(movie)) 
        })
        const movie_dal_stub = sinon.createStubInstance(MovieDetailsDal, {
            save: Promise.resolve(movie),
            incrementCounter: Promise.resolve(),
            find: Promise.resolve(null)
        })
        const MovieService = new MovieDetailsService(movie_info_stub, movie_dal_stub);

        await MovieService.save("12 Angry men", "123");
        sinon.assert.calledOnce(movie_info_stub.fetchAdditionalInfo)
        sinon.assert.calledOnce(movie_dal_stub.save)
        sinon.assert.calledOnce(movie_dal_stub.incrementCounter)
        movie_dal_stub.incrementCounter.restore();
        movie_dal_stub.save.restore();
        movie_dal_stub.find.restore();
        movie_info_stub.fetchAdditionalInfo.restore();
    })

    describe('METHOD get', () => {
        let movie_info_stub: Sinon.SinonStubbedInstance<OMDBService>;
        before(() => {
            movie_info_stub = sinon.createStubInstance(OMDBService)
        })

        after(() => {
            movie_info_stub.fetchAdditionalInfo.restore();
        })

        it ("it should return an array of movies when a user has some movies saved", async () => {
            const movie_dal_stub = sinon.createStubInstance(MovieDetailsDal, {
                get: Promise.resolve(movies)
            });
            const MovieService = new MovieDetailsService(movie_info_stub, movie_dal_stub);
    
            await MovieService.get("123");
            sinon.assert.calledOnce(movie_dal_stub.get);
            movie_dal_stub.get.restore();
        })
    
        it ("it should return an empty array when a user has no movies saved", async () => {
            const movie_dal_stub = sinon.createStubInstance(MovieDetailsDal, {
                get: Promise.resolve([])
            });
            const MovieService = new MovieDetailsService(movie_info_stub, movie_dal_stub);
    
            await MovieService.get("123");
            sinon.assert.calledOnce(movie_dal_stub.get);
            movie_dal_stub.get.restore();
        })
    })
})