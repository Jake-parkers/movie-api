import { ErrorNames } from "../error-handling/common-errors";
import { InAppErrorResponse, buildInAppError, InAppSuccessResponse } from "./response";

export const RuleErrorTypes : {[key: string]: any} = {
    /**
     * gets the appropriate error handler based on the Joi error string
     * @param error 
     * @returns ErrorHandlerType
     */
    getHandler: function (error: string): ErrorHandlerType {
        if (!RuleErrorTypes[error]) {
            throw new Error("ErrorHandler Unavailable")
        }
        return RuleErrorTypes[error];
    },
    
    /**
     * This error type means that the value of the field did not match any of the types specified. 
     * For instance if types "string", "array" and "object" are specified for a field but a numerice value is passed (say 10) this error fires
     * @param error
     * @returns InAppErrorResponse 
     */
    AlternativesTypes: function (error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should be one of ${error.alternativeTypes?.join(", ")}.`);
    },

    /**
     * This error means the value of the field is not of type string
     * @param error
     * @returns InAppErrorResponse
     */
    StringBase: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should be a string.`);
    },

    /**
     * This error means an unwanted field was passed as part of the object
     * @param error
     * @returns InAppErrorResponse
     */
    AnyUnknown: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should not be a part of the object.`)
    },

    /**
     * This error means the value passed does not match any of the predefined options
     * @param error
     * @returns InAppErrorResponse
     */
        AnyOnly: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should be one of '${error.valids?.join(", ")}'.`)
    }, 

    /**
     * This error means a required field was not passed
     * @param field the error'd field
     * @returns InAppErrorResponse 
     */
    AnyRequired: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} is required.`)
    },

    /**
     * This error means the value supplied is not an array
     * @param error
     * @returns InAppErrorResponse
     */
    ArrayBase: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should be an array.`)
    },

    /**
     * This error means the length of the array passed does not meet the minimum requirement
     * @param error 
     * @returns InAppErrorResponse
     */
    ArrayMin: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should have at least ${error.limit} elements.`)
    },

    /**
     * This error means an empty string value was passed
     * @param error 
     * @returns InAppErrorResponse 
     */
    StringEmpty: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} is required and must not be empty.`)
    },

    /**
     * This error means the value of the field is not of type number
     * @param error
     * @returns InAppErrorResponse
     */
    NumberBase: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should be a number.`)
    },

    /**
     * This error means an unwanted field was passed as part of the object
     * @param error
     * @returns InAppErrorResponse
     */
    ObjectUnknown: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should not be a part of the object.`)
    },

    /**
     * This error means the value of the field is not of type object
     * @param error
     * @returns InAppErrorResponse 
     */
    ObjectBase: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `${error.field} should be an object.`)
    },

    /**
     * This error is thrown whenever none of fields specified in an `or` or `xor` were passed in
     * @param error 
     * @returns InAppErrorResponse
     */
    ObjectMissing: function(error: RuleError): InAppErrorResponse {
        return buildInAppError(ErrorNames.PAYLOAD_VALIDATION_ERROR, `Please specify one of ${error.peers?.join(" or ")}`)
    }
}


export type JoiError = `${string}.${string}`

/**
 * Describes the possible fields that could be avaialbe on a Joi Error object
 */
export interface RuleError {
    field: string,
    limit?: number,
    alternativeTypes?: string[],
    valids?: string[],
    peers?: string[],
    peersWithLabels?: string
}

export enum RuleStatus {
    INVALID,
    VALID,
}

export class ValidationStatus {
    status: RuleStatus;
    details: InAppSuccessResponse | InAppErrorResponse | null ;

    constructor(status: RuleStatus, details:  InAppSuccessResponse | InAppErrorResponse  | null){
        this.status = status;
        this.details = details;
    }
}

export type ErrorHandlerType = (error: RuleError) => InAppErrorResponse;



export const DEFAULT_JOI_ERRORS: JoiError[] = ["alternatives.types", "any.unknown", "any.required", "any.only", "array.base", "array.min", "string.empty", "string.base", "number.base", "object.unknown", "object.base", "object.missing"];

export const JOI_ERROR_FORMAT = /^.*\..*$/;

export function convertToJoiFormat(str: string): string {
    let [firstPart, secondPart] = str.split(".");
    firstPart = firstPart.charAt(0).toUpperCase() + firstPart.slice(1)
    secondPart = secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
    return firstPart+secondPart;
}


export function isObject(data: any) {
    return typeof data === 'object' && data !== null && !Array.isArray(data);
}

export function arrayEquals(a: any[], b: any[]) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    }
