import { ErrorNames } from '../error-handling/common-errors';

export enum Status {
  ERROR = 'error',
  SUCCESS = 'success',
}

export interface AppResponse {
  status: Status;
  message?: string;
  data?: any;
  httpCode?: number | null;
}

export class SuccessResponse implements AppResponse {
  status: Status;
  data?: any;
  httpCode?: number;
  message?: string;

  constructor(data: any, message: string, httpCode?: number) {
    this.status = Status.SUCCESS;
    this.data = data;
    this.httpCode = httpCode || 200;
    this.message = message;
  }
}

export type ErrorInfo = { error: string; error_description: string };

export class ErrorResponse implements AppResponse {
  status: Status;
  message: string;
  error?: string;
  error_description?: string;
  constructor(message: string, error_info?: ErrorInfo) {
    this.status = Status.ERROR;
    this.message = message;
    this.error = error_info?.error || '';
    this.error_description = error_info?.error_description || '';
  }
}

export type InAppSuccessResponse = Pick<AppResponse, 'status' | 'data'>;

export type InAppErrorResponse = {
  status: Status;
  type: ErrorNames;
  message?: string;
  data?: any;
};

export type InAppResponse = InAppSuccessResponse | InAppErrorResponse;

export function buildInAppError(type: ErrorNames, message?: string, data?: any): InAppErrorResponse {
  return {
    status: Status.ERROR,
    type,
    message,
    data,
  };
}

export function buildInAppSucess(data?: any): InAppSuccessResponse {
  return {
    status: Status.SUCCESS,
    data,
  };
}
