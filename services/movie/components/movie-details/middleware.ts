import { NextFunction, Request, Response } from "express";
import BadRequestException from "../../error-handling/bad-request-exception";
import { USERROLES } from "./types";
import MovieDetailsService from "./service";
import MovieDetailsDal from "./dal";
import OMDBService from "../omdb/service";
import ForbiddenException from "../../error-handling/forbidden-exception";

const MovieService = new MovieDetailsService(new OMDBService, new MovieDetailsDal);
export function validateMonthlyLimit(req: Request, res: Response, next: NextFunction) {
    const { username, role } = req.body;
    if (!username ) {
       throw new BadRequestException({message: "Username is required"});
    }

    if (!role ) {
        throw new BadRequestException({message: "user role is required"});
     }

    if (role === USERROLES.BASIC) {
        MovieService.validateLimit(username).then(isValid => {
            if (isValid) return next();
            else return next(new ForbiddenException({message: "User monthly limit reached", error_info: {error: "monthly_limit_reached", error_description: "" }}));
        }).catch(error => {
            throw error;
        })
    } else {
        next()
    }

}