import { InAppException } from './base';

/**
 * Describes an error relating to a record not having the necessary perimission to perform an action. To be used in the service layer only
 * @param error_info
 */
class PermissionException extends InAppException {
  constructor(description = 'not permitted to perform action', data?: any) {
    super('not_permitted', description, data);
  }
}

export default PermissionException;
