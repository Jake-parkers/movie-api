import { InAppException } from "./base";

/**
 * Describes an error relating to a record existing already in the database. To be used in the service layer only
 * @param error_info
 */
class InvalidPasswordException extends InAppException {
    constructor (description = "invalid password") {
        super("invalid_password", description);
    }
}

export default InvalidPasswordException