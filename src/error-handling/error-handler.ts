import AppException from './base';
import { Response } from 'express';
import Logger from '../helpers/logger';
import { handleResponse } from '../components';
import { CommonErrors } from './common-errors';
import InternalServerException from './internal-server-exception';

/**
 * Handles everything related to errors.
 * @method logError(error: any)
 * @method handleError(err: any, responseStream?: Response)
 * @method isTrustedError(error: Error
 */
export default class ErrorHandler {
  protected customLogger: typeof Logger;

  constructor(logger: typeof Logger) {
    this.customLogger = logger;
  }

  /**
   * Logs errors using the logger.
   * @param error
   * @returns void
   */
  public async logError(error: any) {
    console.log('We logging: ', error);
    if (error instanceof AppException) this.customLogger.error(error.data);
    else this.customLogger.error(error.stack || error, { type: 'SERVERERROR' });
  }

  /**
   * Handles AppException errors and other generic errors. For AppException errors and those of its subclasses, it uses the http code passed, for all other errors it defaults to a 500 error. Operational errors are logged and returned to the client. Programmer errors on the other hand are logged, returned to the client with Http 500 code and then closes all connections and restarts the server
   * @param err
   * @param responseStream
   * @returns void
   */
  public async handleError(err: any, responseStream?: Response): Promise<void> {
    this.logError(err);
    if (err instanceof AppException) {
      handleResponse(err, responseStream as Response);

      if (!err.isOperational) throw err; // this would be caught by process.uncaughtException and handled accordingly
    } else {
      handleResponse(
        new InternalServerException({ message: CommonErrors.GENERIC_SERVER_ERROR }),
        responseStream as Response,
      );

      throw err; // this would be caught by process.uncaughtException and handled accordingly
    }
  }

  /**
   * Determines whether an error is a programmer error or an operational one
   * @param error
   * @returns boolean
   */
  public isTrustedError(error: Error) {
    if (error instanceof AppException) {
      return error.isOperational;
    }
    return false;
  }
}
