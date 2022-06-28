/**
 * Compilation of errors that could occur
 * @enum
 */
export enum CommonErrors {
    INVALID_JSON_PAYLOAD = "Invalid JSON",
    GENERIC_SERVER_ERROR = "An error occurred while processing your request. Please try again",
}

/**
 * Compilation of error names to use in describing errors
 * @enum
 */
export enum ErrorNames {
    BAD_REQUEST = "BADREQUEST",
    PAYLOAD_VALIDATION_ERROR = "invalid_payload",
    NOT_FOUND_ERROR =  "RESOURCENOTFOUND",
    SERVER_ERROR =  "SERVERERROR",
    UNAUTHORIZED = "not_authorized",
}