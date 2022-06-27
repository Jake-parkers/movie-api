// import mockedEnv, { RestoreFn } from "mocked-env";
// import { expect } from "chai";
// import AuthService from "../../components/authentication/service"
// import { valid_user, invalid_user } from "./data";
// import 'mocha';


// import AuthError from "../../error-handling/auth-error";

// describe('Method getToken', () => {
//     let restore: RestoreFn;
//     before(() => {
        // restore = mockedEnv({
        //     JWT_SECRET: 'secret',
        // })
//     })
//     after(() => restore())
//     it ('when supplied with a valid user id, it should return a JWT', () => {
//         const auth = new AuthService();
//         const token = auth.getToken(valid_user.username, valid_user.password);
//         expect(token).to.be.a('string');
//         expect(token).not.be.empty
//     })

//     it ('when supplied with an invalid user id, it should throw AuthError', () => {
//         const auth = new AuthService();
//         expect(() => auth.getToken(invalid_user.username, invalid_user.password)).to.throw(AuthError)
//     })
// })