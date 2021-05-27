import axios, {
    AxiosError,
    AxiosRequestConfig,
} from 'axios';
import {
    IAxiosRetryConfig,
} from 'axios-retry';

import {
    fetch as FETCH,
} from 'common/configs/request';

const {
    retries: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
} = FETCH.options;

const DEFAULT_RETRIES_CONFIG = {
    retries: DEFAULT_RETRIES,
    retryDelay: () => DEFAULT_RETRY_DELAY,
    retryCondition: (error: AxiosError) => error.response?.status === 502 || ['ESOCKETTIMEDOUT', 'ETIMEDOUT'].includes(error.code),
};

export interface IFetchResponse<T = any> {
    data: T;
    status: number;
    config: AxiosRequestConfig;
}

function buildResponse(response: IFetchResponse) {
    return {
        data: response.data,
        status: response.status,
        config: response.config,
    };
}

export default async function fetch<T = any>(url: string, config: AxiosRequestConfig, axiosRetryConfig?: IAxiosRetryConfig): Promise<IFetchResponse<T>> {
    const {
        headers: configHeaders = {},
        data,
        params = {},
        responseType = 'json',
        method,
        withCredentials = true,
        ...restConfig
    } = config;

    const axiosRetryOptions: IAxiosRetryConfig = {
        ...DEFAULT_RETRIES_CONFIG,
        ...axiosRetryConfig,
    };

    const headers = {
        'Content-Type': 'application/json',
        ...configHeaders,
    };

    const options: AxiosRequestConfig = {
        ...restConfig,
        data,
        method: method || (data ? 'POST' : 'GET'),
        headers,
        responseType,
        params,
        url,
        withCredentials,
    };

    const response = await axios(url, {
        ...options,
        'axios-retry': axiosRetryOptions,
    } as AxiosRequestConfig);

    return buildResponse(response);
}
