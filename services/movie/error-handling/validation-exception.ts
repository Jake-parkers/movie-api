import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 400 error relating to when invalid request params are sent
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */
class ValidationException extends AppException {
    constructor (data: ErrorData, isOperational = true, ) {
        const name = ErrorNames.NOT_FOUND_ERROR;
        const httpCode = HttpStatusCode.BAD_REQUEST;
        super(name, data, isOperational, httpCode);
    }
}

export default ValidationException