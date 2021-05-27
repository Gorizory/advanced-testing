import {
    IAnswer,
    IEvent,
    IResult,
} from 'common/types';

import {
    fetchBackend,
} from 'client/libs/request';
import {
    handlers,
} from 'common/configs/request';

export async function createResult(testId: string) {
    return fetchBackend<IResult>(`${handlers.tests.createResult}/${testId}`, {
        method: 'POST',
    });
}

export async function addEventToResult(resultId: string, event: IEvent) {
    return fetchBackend<void>(`${handlers.tests.updateResult}/${resultId}`, {
        method: 'PATCH',
        data: event,
    });
}

export async function addAnswer(resultId: string, answer: IAnswer) {
    return fetchBackend<IResult>(`${handlers.tests.answer}/${resultId}`, {
        method: 'POST',
        data: answer,
    });
}
