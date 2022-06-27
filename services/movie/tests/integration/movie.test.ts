import request from "supertest";
import 'mocha'
import { expect } from "chai"
import app from "../../index";
import { dummyMovieData } from "./data";
import MovieModel from "../../components/movie-details/models/movie";
import { dbDisconnect } from "../../database/inmemorydb";
import dotenv from "dotenv"
import MovieDal from "../../components/movie-details/dal";

describe("Movie API test", () => {

    before(() => {
        dotenv.config();
    })

    after(async () => {
        await dbDisconnect();
    })

    describe('GET /movies', () => {
        before(async () => {
            const new_movie = new MovieModel(dummyMovieData);
            await new_movie.save();
        })

        it ('when a user that has created movies sends a request, it should return all the movies for that user', async () => {
            const response = await request(app).get(`/movies?user_id=${dummyMovieData.User_id}`).set('Accept', 'application/json')
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null;
            expect(response.body.data).to.be.an("object")
            const { data } = response.body.data
            expect(data).to.be.an("array");
            expect(data).to.not.be.empty;
        })
    
        it ('when a user that has no movies sends a request, it should return all an empty list', async () => {
            const response = await request(app).get(`/movies?user_id=no_id`).set('Accept', 'application/json')
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null;
            expect(response.body.data).to.be.an("object")
            const { data } = response.body.data
            expect(data).to.be.an("array");
            expect(data).to.be.empty;
        })
    })

    describe('POST /movies', () => {
        const movie_title = 'The Godfather'
        it ('when a valid movie title is provided, it should create a movie for the user and return a 200', async () => {
            const response = await request(app).post(`/movies?user_id=${dummyMovieData.User_id}&role=premium`).set('Accept', 'application/json')
            .send({ title: movie_title })
            .set('Accept', 'application/json')
            expect(response.status).to.equal(200);
            expect(response.body).to.not.be.null
            expect(response.body.data).to.be.an("object")
            expect(response.body.data.Title).to.equal(movie_title)
        })

        it ("when a invalid movie title is provided, it should return a 400 response", async () => {
            const movie_title = 'wndjdiowqdboid'
            const response = await request(app).post(`/movies?user_id=900&role=premium`).set('Accept', 'application/json')
            .send({ title: movie_title })
            .set('Accept', 'application/json')
            expect(response.status).to.equal(400);
            expect(response.body).to.not.be.null;
            expect(response.body.error).to.equal("invalid_movie_title");
        })

        it ('when a user tries to create the same movie more than once, it should return a 400 response', async () => {
            const response = await request(app).post(`/movies?user_id=${dummyMovieData.User_id}&role=premium`).set('Accept', 'application/json')
            .send({ title: movie_title })
            .set('Accept', 'application/json')
            expect(response.status).to.equal(400);
            expect(response.body).to.not.be.null;
            expect(response.body.error).to.equal("duplicate_movie_title")
        })

        describe('Monthly limit validity for basic users', () => {
            const user_id = "3000";
            before(async () => {
                const movieDal = new MovieDal();
                await movieDal.resetCounter(user_id, 5); 
            })

            it ('when a basic user has reached their max monthly limit, any request to create a movie in that month should fail with a 403 response', async () => {
                const response = await request(app).post(`/movies?user_id=${user_id}&role=basic`)
                .send({ title: movie_title })
                .set('Accept', 'application/json')
                expect(response.status).to.equal(403);
                expect(response.body).to.not.be.null;
                expect(response.body.error).to.equal("monthly_limit_reached")
            })
        })
    })
})