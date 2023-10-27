import getEnv from '../config/getEnv';

export namespace API {
  enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
  }

  

  interface Result<T> {
    data: T | any;
    statusCode: HttpStatus | number;
  }

  interface RequestState<T> {
    error?: Error | unknown | any;
    result: Result<T>;
    statusCode?: HttpStatus;
  }

  type RequestType = 'get' | 'post' | 'put' | 'delete' | 'patch';

  interface RequestConfig {
    path: string;
    signal: AbortSignal;
    requestType: RequestType;
    body?: Record<any, any> | undefined;
    query?: Record<any, unknown>;
    pathParams?: Record<any, unknown>;
  }

  function buildQueryString(queryParams: Record<any, unknown>): string {
    let queryString = '?';
    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const queryValue = queryParams[key];
        queryString += `${key}=${queryValue}`;
      }
    }

    return queryString.length == 1 ? '' : queryString;
  }

  function buildPathParams(url: string, pathParams: Record<any, any>): string {
    let requestUrl = url;

    for (const key in pathParams) {
      if (Object.prototype.hasOwnProperty.call(pathParams, key)) {
        const paramValue = pathParams[key];
        requestUrl = requestUrl.replace(key, paramValue);
      }
    }

    return requestUrl;
  }

  export async function callApi<T>({
    path,
    signal,
    requestType = 'get',
    body = undefined,
    query,
    pathParams,
  }: RequestConfig): Promise<RequestState<T>> {
    const state: RequestState<T> = { result: {} as Result<T> };
    try {
      const API_URL = await getEnv('API_URL');
      let requestUrl: string = `${API_URL}${path}`;
      if (pathParams) {
        requestUrl = buildPathParams(path, pathParams);
      }

      if (query) {
        requestUrl += buildQueryString(query);
      }

      const response: Awaited<Promise<Response>> = await fetch(requestUrl, {
        signal,
        body: JSON.stringify(body),
        method: requestType,
      });
      state.result = await response.json();
      state.statusCode = response.status;
    } catch (error: any) {
      state.error = error.message;
      state.statusCode = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return state;
  }
}
