import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 403 error
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */

class ForbiddenException extends AppException {
    constructor (data: ErrorData, isOperational = true) {
        const name = ErrorNames.FORBIDDEN_EXCEPTION;
        const http_code = HttpStatusCode.FORBIDDEN
        super(name, data, isOperational, http_code);
    }
}

export default ForbiddenException;