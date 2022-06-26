import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 500 error. This exception marks the error as a programmer one and hence restarts the server 
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */
class InternalServerException extends AppException {
    constructor (data: ErrorData, isOperational = false) {
        const name = ErrorNames.SERVER_ERROR;
        const httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR
        super(name, data, isOperational, httpCode);
    }
}

export default InternalServerException;