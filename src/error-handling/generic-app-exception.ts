import AppException, { ErrorData } from "./base";
import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorNames } from "./common-errors";

/**
 * Describes a Http 500 error. This exception marks the error as operational and hence doesn't restart the server 
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines whether the error reported is an operational error or a programmer error. Defaults to `true`
 */
class GenericServerException extends AppException {
    constructor (data: ErrorData, isOperational = true) {
        const name = ErrorNames.SERVER_ERROR;
        const http_code = HttpStatusCode.INTERNAL_SERVER_ERROR
        super(name, data, isOperational, http_code);
    }
}

export default GenericServerException;