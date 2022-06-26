import { Request, Response, NextFunction } from "express";
import BadRequestException from "../../error-handling/bad-request-exception";
import UnauthorizedException from "../../error-handling/unauthorized-exception";
import jwt from "jsonwebtoken";
import { UserAccessTokenPayload } from "./types";

export function validateUserToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) {
        throw new UnauthorizedException({ message: 'Missing authorization' });
        }
    
        const token = req?.headers ? req.headers.authorization.split(' ') : [];
    
        // check that the value of the `Authorization` header contains both `Bearer` and `${value}`
        if (token.length !== 2)
        throw new BadRequestException({
            message: '',
            error_info: { error: 'invalid_request', error_description: 'Invalid request' },
        });
    
        if (token[0] !== 'Bearer')
        throw new UnauthorizedException({
            message: 'Invalid Token',
            error_info: { error: 'invalid_token', error_description: 'Token type provided is not valid' },
        });
        const result = jwt.verify(token[1], process.env.JWT_SECRET) as UserAccessTokenPayload;
        req.query.role = result.role;
        req.query.user_id = String(result.userId);
        next()
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return next(new UnauthorizedException({
          message: error.message,
          error_info: { error: 'invalid_token', error_description: 'the token provided has expired' },
          context: { expired_at: error.expiredAt },
        }));
      }
  
      if (error.name === 'JsonWebTokenError') {
        return next(new UnauthorizedException({
          message: 'Malformed Token',
          error_info: { error: 'invalid_token', error_description: "" },
        }));
      }
      next(error);
    }
  }