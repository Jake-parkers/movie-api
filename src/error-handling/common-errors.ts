/**
 * Compilation of errors that could occur
 * @enum
 */
export enum CommonErrors {
    INVALID_JSON_PAYLOAD = "Invalid JSON",
    SAVE_ERROR = "Error saving to DB",
    APP_REGISTRATION_ERROR = 'An error occurred while registering application',
    USER_REGISTRATION_ERROR = 'An error occurred while registering user',
    HANDLER_NOT_FOUND = "Missing error handler",
    GENERIC_SERVER_ERROR = "An error occurred while processing your request. Please try again",
    NOT_FOUND_ERROR =  "Resource Not Found",
    TOKEN_ISSUE_ERROR = 'An error occurred while generating access token',
    DUPLICATE_KEY_ERROR = "This record exists already",
    MONGOOSE_VALIDATION_ERROR = "One or more required parameters are missing",
    GENERIC = "GENERIC"
}

/**
 * Compilation of error names to use in describing errors
 * @enum
 */
export enum ErrorNames {
    NOT_FOUND_ERROR =  "RESOURCENOTFOUND",
    SERVER_ERROR =  "SERVERERROR",
    DAL_EXCEPTION = "DATABASEERROR",
    FORBIDDEN_EXCEPTION = "ACCESSFORBIDDEN",
    ALREADY_EXISTS = "already_exists",
    INVALID_AUTH = "invalid_auth",
    TOKEN_EXISTS = "token_exists",
    TOKEN_GENERATION_ERROR = "token_genration_exists",
    VALIDATION_ERROR = "VALIDATIONERROR",
    BAD_REQUEST = "BADREQUEST",
    PAYLOAD_VALIDATION_ERROR = "invalid_payload",
    UNAUTHORIZED = "not_authorized",
    SERVICE_EXCEPTION = "SERVICEERROR",
    APP_ERROR="APPERROR",
    REGISTRATION_ERROR = "register_error",
    GENERIC_ERROR="server_error",
    NOT_FOUND="not_found",
    INVALID_RESOURCE_SERVER = "invalid_resource_server",
}