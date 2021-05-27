import {
    AxiosRequestConfig,
} from 'axios';

import {
    backend as BACKEND,
} from 'common/configs/request';

import fetch from 'common/libs/request';

export async function fetchBackend<ResponseEntity = any>(handler: string, config: AxiosRequestConfig) {
    const {
        data,
    } = await fetch<Record<string, ResponseEntity> | null>(`${BACKEND.hostname}${handler}`, config);
    return data;
}
