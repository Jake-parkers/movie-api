import request from "supertest";
import mockedEnv, { RestoreFn } from "mocked-env";
import 'mocha'
import { expect } from "chai"
import app from "../../index";
import dotenv from "dotenv";
import { basic_user, invalid_user } from "./data";

describe('Auth API Test', () => {
    let restore: RestoreFn;
    before(() => {
        dotenv.config();
        restore = mockedEnv({
            JWT_SECRET: 'secret',
        })
    })

    after(() => restore())

    it ('when a valid user tries to authenticate, it should return a JWT', async () => {
        const response = await request(app).post('/auth').send(basic_user).set('Accept', 'application/json')
        expect(response.status).to.equal(200);
        expect(response.body).to.not.be.null;
        expect(response.body.data).to.be.a("string");
        expect(response.body.data).to.not.be.empty;
    })

    it ('when an invalid user tries to authenticate, it should return a 400 response', async () => {
        const response = await request(app).post('/auth').send(invalid_user).set('Accept', 'application/json')
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
    })
})