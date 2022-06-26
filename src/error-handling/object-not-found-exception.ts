import { InAppException } from "./base";

/**
 * Describes an error relating to a record not existing in the database. To be used in the service layer only
 * @param error_info 
 */
class ObjectNotFoundException extends InAppException {
    constructor (description = "record not found") {
        super("object_not_found", description);
    }
}

export default ObjectNotFoundException