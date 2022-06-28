import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 401 error
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */
class UnauthorizedException extends AppException {
    constructor (data: ErrorData, isOperational = true) {
        const name = ErrorNames.UNAUTHORIZED
        const httpCode = HttpStatusCode.UNAUTHORIZED
        super(name, data, isOperational, httpCode);
    }
}

export default UnauthorizedException;

