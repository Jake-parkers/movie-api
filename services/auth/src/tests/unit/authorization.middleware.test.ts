import { Request, Response } from 'express';
import {validateUserToken} from '../../components/authentication/middleware';
import sinon from "sinon"
import { expect } from 'chai';
import { ErrorNames } from '../../error-handling/common-errors';
import { expired_token, valid_user } from './data';
import AuthService from "../../components/authentication/service"
import mockedEnv, { RestoreFn } from "mocked-env";

describe('Auth Middleware', () => {
    let request_mock: Partial<Request>;
    let response_mock: Partial<Response>;
    let next_mock = sinon.spy()
    before(() => {
        request_mock = {
            query: {},
            headers: {}
        }
        response_mock = {}
    })

    beforeEach(() => {
        next_mock = sinon.spy()
    })

    it('When a movie request is sent without an authorization header it should return an unauthorized error', () => {
        validateUserToken(request_mock as Required<Request>, response_mock as Required<Response>, next_mock);
        const { name, data } = next_mock.getCall(0).firstArg;
        expect(name).to.equal(ErrorNames.UNAUTHORIZED)
        expect(data).to.be.an("object")
        expect(data.message).to.equal("Missing authorization")
    })

    it('When a movie request is sent with an invalid authorization header, it should return a bad request error', () => {
        request_mock = {
            query: {},
            headers: {
                "authorization": "token"
            }
        }
        validateUserToken(request_mock as Required<Request>, response_mock as Required<Response>, next_mock);
        const { name, data } = next_mock.getCall(0).firstArg;
        expect(name).to.equal(ErrorNames.BAD_REQUEST)
        expect(data).to.be.an("object")
        expect(data.error_info).to.be.an("object")
        expect(data.error_info.error).to.equal("invalid_request")
    })

    it('When a movie request is sent with a token type that is not `Bearer`, it should return an `invalid token` unauthorized error', () => {
        request_mock = {
            query: {},
            headers: {
                "authorization": "Basic token"
            }
        }
        validateUserToken(request_mock as Required<Request>, response_mock as Required<Response>, next_mock);
        const { name, data } = next_mock.getCall(0).firstArg;
        expect(name).to.equal(ErrorNames.UNAUTHORIZED)
        expect(data).to.be.an("object")
        expect(data.message).to.equal("Invalid Token")
    })

    it('When a movie request is sent with a token that is not a JWT, it should return a `malformed token` unauthorized error', () => {
        request_mock = {
            query: {},
            headers: {
                "authorization": "Bearer not_a_jwt"
            }
        }
        validateUserToken(request_mock as Required<Request>, response_mock as Required<Response>, next_mock);
        const { name, data } = next_mock.getCall(0).firstArg;
        expect(name).to.equal(ErrorNames.UNAUTHORIZED)
        expect(data).to.be.an("object")
        expect(data.message).to.equal("Malformed Token")
    })

    it('When a movie request is sent with an expired token , it should return an unauthorized error', () => {
        request_mock = {
            query: {},
            headers: {
                "authorization": `Bearer ${expired_token}`
            }
        }
        validateUserToken(request_mock as Required<Request>, response_mock as Required<Response>, next_mock);
        const { name, data } = next_mock.getCall(0).firstArg;
        expect(name).to.equal(ErrorNames.UNAUTHORIZED)
        expect(data).to.be.an("object")
        expect(data.error_info).to.be.an("object")
        expect(data.error_info.error).to.equal("invalid_token")
    })

    describe('Positive Test', () => {
        let token = "";
        let restore: RestoreFn;
        before(() => {
            restore = mockedEnv({
                JWT_SECRET: 'secret',
            })
            const authService = new AuthService();
            token = authService.getToken(valid_user.username, valid_user.password);
        })

        after(() => restore())

        it('When a movie request is sent with a valid token', () => {
            request_mock = {
                query: {
                    role: "basic",
                    user_id: "123"
                },
                headers: {
                    "authorization": `Bearer ${token}`
                }
            }
            validateUserToken(request_mock as Required<Request>, response_mock as Required<Response>, next_mock);
            expect(next_mock.calledOnce).to.be.true;
            expect(next_mock.getCall(0).args).to.be.empty
            expect(next_mock.getCall(0).firstArg).to.be.undefined
        })

    })

})