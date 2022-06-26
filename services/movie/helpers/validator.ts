import Joi from "joi";
import { InAppErrorResponse, Status } from "./response";
import { JOI_ERROR_FORMAT, JoiError, ValidationStatus, RuleErrorTypes, DEFAULT_JOI_ERRORS, convertToJoiFormat, ErrorHandlerType, RuleError, RuleStatus } from "./validator-helper";

/**
 * Describes methods every custom validator should have
 */
export interface CustomValidator {
    addErrorType(errorType: JoiError): void
    defineSchema(schema: Joi.Schema): CustomValidator
    validate(data: object): ValidationStatus
}
class Validator {

    private ruleErrorType: typeof RuleErrorTypes;
    private schema: Joi.Schema;
    private errorTypes: JoiError[];
    private ruleErrors: Map<JoiError, string> = new Map<JoiError, string>();
    
    constructor() {
        this.ruleErrorType = RuleErrorTypes.AnyRequired;
        this.schema = Joi.object();
        this.errorTypes = JSON.parse(JSON.stringify(DEFAULT_JOI_ERRORS));
        for (const errorType of this.errorTypes) {
            // check that error matches Joi error format
            if (!errorType.match(JOI_ERROR_FORMAT)) {
                throw new Error(`'${errorType}' does not match Joi error format (blah.blah)`);
            }
            this.ruleErrors.set(errorType, convertToJoiFormat(errorType))
        }
    }

    /**
     * Adds a Joi error type to the set of errors
     * @param errorType 
     */
    addErrorType(errorType: JoiError): void {
        if (!errorType.match(JOI_ERROR_FORMAT)) {
            throw new Error(`'${errorType}' does not match Joi error format (blah.blah)`);
        }
        this.errorTypes.push(errorType);
        this.ruleErrors.set(errorType, convertToJoiFormat(errorType))  
    }

    /**
     * 
     * @param schema 
     * @returns Validator
     */
    defineSchema(schema: Joi.Schema): this {
        this.schema = schema;
        return this;
    }

    /**
     * Handles errors returned from Joi 
     * @param type 
     * @param error 
     * @returns ValidationStatus
     */
    private handleSchemaError(type: JoiError, error: RuleError): ValidationStatus {
        const errorType = this.ruleErrors.get(type);
        const errorHandler: ErrorHandlerType = RuleErrorTypes.getHandler(errorType as string);
        const result: InAppErrorResponse = errorHandler(error);
        return new ValidationStatus(RuleStatus.INVALID, result);
    }

    /**
     * validates the data using the defined schema
     * @param data 
     * @returns ValidationStatus
     */
    public validate(data: object): ValidationStatus {
        const result = this.schema.validate(data);
        if (result.error) {
            const details = result.error.details[0];
            return this.handleSchemaError(details.type as JoiError, {field: details.path[details.path.length - 1] as string, alternativeTypes: details.context?.types, limit: details.context?.limit, valids: details.context?.valids, peers: details.context?.peers, peersWithLabels: details.context?.peersWithLabels });
        }
        return new ValidationStatus(RuleStatus.VALID, { status: Status.SUCCESS, data: result.value} );
    }
}

export default Validator