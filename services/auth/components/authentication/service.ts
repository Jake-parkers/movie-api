import { Auth } from './types';
import users from './data';
import AuthError from '../../error-handling/auth-error';
import jwt from 'jsonwebtoken';

class AuthService implements Auth {
  getToken(username: string, password: string): string {
    const user = users.find((u) => u.username === username);

    if (!user || user.password !== password) throw new AuthError('invalid username or password');

    return jwt.sign(
      {
        userId: user.id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        issuer: 'https://www.netguru.com/',
        subject: `${user.id}`,
        expiresIn: 30 * 60,
      },
    );
  }
}

export default AuthService;
