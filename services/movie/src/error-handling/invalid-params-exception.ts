import { InAppException } from './base';

/**
 * Describes an error relating to invalid vales passed for some parameters
 * @param error_info
 */
class InvalidParamsException extends InAppException {
  constructor(description = 'not permitted to perform action', data?: any) {
    super('invalid_data', description, data);
  }
}

export default InvalidParamsException;
