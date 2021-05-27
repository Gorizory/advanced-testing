import {
    ITest,
} from 'common/types';

import {
    fetchBackend,
} from 'client/libs/request';
import {
    handlers,
} from 'common/configs/request';

export async function startCreatingTest() {
    return fetchBackend<ITest>(`${handlers.tests.create}`, {
        method: 'POST',
    });
}

export async function fetchTest(testId: string, key?: string) {
    return fetchBackend<ITest>(`${handlers.tests.getOne}/${testId}`, {
        method: 'GET',
        params: {
            key,
        },
    });
}

export async function updateTest(testId: string, test: Partial<ITest>, key?: string) {
    return fetchBackend<ITest>(`${handlers.tests.update}/${testId}`, {
        method: 'PATCH',
        params: {
            key,
        },
        data: test,
    });
}

