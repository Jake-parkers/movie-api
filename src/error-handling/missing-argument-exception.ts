import { InAppException } from "./base";

/**
 * Describes an error relating to a record not having the necessary perimission to perform an action. To be used in the service layer only
 * @param error_info
 */
class MissingArgumentException extends InAppException {
    constructor (description = "one or more required arguments are missing") {
        super("missing_argument", description);
    }
}

export default MissingArgumentException