import { InAppException } from "./base";

/**
 * Describes an error relating to a record existing already in the database. To be used in the service layer only
 * @param error_info
 */
class ObjectExistsException extends InAppException {
    constructor (description = "Record exists already") {
        super("object_exists", description);
    }
}

export default ObjectExistsException