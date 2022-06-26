import { HttpStatusCode } from "../helpers/httpStatusCodes";
import { ErrorInfo } from "../helpers/response";

/**
 * Describes all of the possible properties related to an error raise by any of the exception classes
 */
export interface ErrorData {
    message: string;
    error_info?: ErrorInfo;
    /**
     * put any other information that could help debug the error here
     */
    context?: any;
    /**
     * the component the error happened in
     */
    component?: string;
    /**
     * the error stack
     */
    stack?: string
    /**
     * this is automatically generated. No need to supply a value for this
     */
    timestamp?: string
}

/**
 * Base exception class which all other specialized exceptions derive from
 * @param name
 * @param data holds error related information see [[ ErrorData | ErrorData interface ]]
 * @param isOperational determines if the error is an operational one or a programmer errror
 * @param httpCode
 * @param optional_key uniquely identifies the error
 *
 */
class AppException extends Error {
    public readonly name: string;
    public data: ErrorData
    public httpCode: HttpStatusCode | null;
    public isOperational: boolean;
    public optional_key?: string | null

    constructor(
        name: string,
        data: ErrorData,
        isOperational: boolean,
        httpCode: HttpStatusCode | null,
        optional_key?: string | null,
    ) {
        super(data.message);
    
        Object.setPrototypeOf(this, new.target.prototype);
    
        this.name = name;
        this.data = data;
        this.data.timestamp = (new Date()).toJSON();
        this.httpCode = httpCode || null;
        this.isOperational = isOperational;
        this.optional_key = optional_key || null;
    
        Error.captureStackTrace(this);
    }
}

export class InAppException extends Error {
    public readonly name: string;
    public description: string;
    public data: any;
  
    constructor(name: string, description: string, data?: any) {
      super(description);
  
      Object.setPrototypeOf(this, new.target.prototype);
  
      this.name = name;
      this.description = description;
      this.data = data;
      Error.captureStackTrace(this);
    }
}

export default AppException;