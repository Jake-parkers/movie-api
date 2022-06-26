import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { InAppException } from '../error-handling/base';
import InvalidParamsException from '../error-handling/invalid-params-exception';
import ObjectExistsException from '../error-handling/object-exists-exception';
import ObjectNotFoundException from '../error-handling/object-not-found-exception';
import PermissionException from '../error-handling/permission-exception';
import { buildInAppSucess, InAppSuccessResponse } from './response';

export enum MakeRequestErrors {
  UNAUTHORIZED = 'unauthorized_error',
  SERVER_ERROR = 'external_server_error',
}

/**
 * Wrapper around axios calls
 * @param req_options
 * @returns InAppSuccessResponse
 * @exceptions InvalidParamsException | InAppException
 */
export const makeRequest = async (req_options: AxiosRequestConfig): Promise<InAppSuccessResponse> => {
  try {
    const response = await axios(req_options);
    return buildInAppSucess(response.data);
  } catch (error: any) {
    // all status codes here will be outside the 2xx range i.e 3xx, 4xx, 5xx.
    if (error?.code === 'ECONNREFUSED') {
      throw new InAppException(MakeRequestErrors.SERVER_ERROR, `Call to ${req_options.url} did not respond.`);
    }
    if (error && error.isAxiosError) {
      const axios_error: AxiosError = error as AxiosError;
      if (axios_error.response?.status === 400 || axios_error.response?.status === 422)
        throw new InvalidParamsException('', axios_error.response.data);
      if (axios_error.response?.status === 500)
        throw new InAppException(
          MakeRequestErrors.SERVER_ERROR,
          `Call to ${req_options.url} failed`,
          axios_error.response.data,
        );

      if (axios_error.response?.status === 401)
        throw new InAppException(
          MakeRequestErrors.UNAUTHORIZED,
          `Call to ${req_options.url} requires authorization. See "data" object for more info`,
          axios_error.response.data,
        );

      if (axios_error.response?.status === 403)
        throw new PermissionException(axios_error.response.statusText, axios_error.response.data);

      if (axios_error.response?.status === 404)
        throw new ObjectNotFoundException(axios_error.response.statusText, axios_error.response.data);

      if (axios_error.response?.status === 409)
        throw new ObjectExistsException(axios_error.response.statusText, axios_error.response.data);
    }
    throw error;
  }
};
