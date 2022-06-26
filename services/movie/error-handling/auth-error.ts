import { InAppException } from './base';

class AuthError extends InAppException {
  constructor(description = '') {
    super('auth_error', description);
  }
}

export default AuthError;
