import AuthError from '../../error-handling/auth-error';
import BadRequestException from '../../error-handling/bad-request-exception';
import { validate } from '../../helpers/misc';
import { SuccessResponse } from '../../helpers/response';
import { CustomValidator } from '../../helpers/validator';
import { Auth } from './types';
import { LOGIN_SCHEMA } from './validation-schema';

class AuthController {
  private AuthService: Auth;
  private Validator: CustomValidator;
  constructor(auth_service: Auth, validator: CustomValidator) {
    this.AuthService = auth_service;
    this.Validator = validator;
  }

  authenticate(data: { username: string; password: string }) {
    try {
      const result = validate(data, this.Validator, LOGIN_SCHEMA);
      const { username, password } = result.data;
      const token = this.AuthService.getToken(username, password);
      return new SuccessResponse(token, 'Login Successful');
    } catch (error) {
      console.log('Instance --> ', error instanceof AuthError);
      console.log('Error --> ', error);
      if (error instanceof AuthError) {
        console.error('Got here');
        throw new BadRequestException({ message: error.message });
      }
      throw error;
    }
  }
}

export default AuthController;
