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

export async function addEventsToResult(resultId: string, events: IEvent[]) {
    return fetchBackend<void>(`${handlers.tests.updateResult}/${resultId}`, {
        method: 'PATCH',
        data: events,
    });
}

export async function addAnswer(resultId: string, answer: IAnswer, events: IEvent[]) {
    return fetchBackend<IResult>(`${handlers.tests.answer}/${resultId}`, {
        method: 'POST',
        data: {
            answer,
            events,
        },
    });
}
