import Joi from 'joi';
import ValidationException from '../error-handling/validation-exception';
import { buildInAppSucess, InAppErrorResponse, InAppResponse, InAppSuccessResponse } from './response';
import { CustomValidator } from './validator';
import { RuleStatus } from './validator-helper';

/**
 * Checks if a variable holds a value that is an object
 * @param obj
 * @returns boolean
 */
export function isObject(data: any) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

/**
 * Removes properties that do not have valid values from an object
 * @param data object to be stripped of it's properties with invalid values
 * @returns an object with only properties that have valid values from the original object passed
 */
export function stripEmptyProperties(data: any) {
  if (!isObject(data)) return data;

  const new_data: { [key: string]: any } = {};
  for (const key in data) {
    if (data[key]) new_data[key] = data[key];
  }
  return new_data;
}

export function validate(data: object, validator: CustomValidator, schema: Joi.Schema): InAppResponse {
  const result = validator.defineSchema(schema).validate(data);

  if (result.status === RuleStatus.INVALID) {
    const error_details = result.details as InAppErrorResponse;
    throw new ValidationException({ message: error_details.message as string, context: data });
  }

  const success_details = result.details as InAppSuccessResponse;
  return buildInAppSucess(success_details.data);
}
