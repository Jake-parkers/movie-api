import { InAppException } from './base';

/**
 * Describes an error relating to a record existing already in the database. To be used in the service layer only
 * @param error_info
 */
class ObjectExistsException extends InAppException {
  constructor(description = 'Record exists already', data?: any) {
    super('object_exists', description, data);
  }
}

export default ObjectExistsException;
