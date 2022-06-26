import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 400 error
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */
class BadRequestException extends AppException {
    constructor (data: ErrorData, isOperational = true) {
        const name = ErrorNames.BAD_REQUEST
        const http_code = HttpStatusCode.BAD_REQUEST
        super(name, data, isOperational, http_code);
    }
}

export default BadRequestException