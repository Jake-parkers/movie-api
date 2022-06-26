import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 404 error
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */

class NotFoundException extends AppException {
    constructor (data: ErrorData, isOperational = true) {
        const name = ErrorNames.NOT_FOUND_ERROR;
        const httpCode = HttpStatusCode.NOT_FOUND;
        super(name, data, isOperational, httpCode);
    }
}

export default NotFoundException