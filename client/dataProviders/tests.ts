import {
    ITask,
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

export async function fetchTask(taskId: string, key?: string) {
    return fetchBackend<ITask>(`${handlers.tests.getTask}/${taskId}`, {
        method: 'GET',
        params: {
            key,
        },
    });
}

export async function createTask(testId: string, task: ITask, key: string) {
    return fetchBackend<ITask | ITest>(`${handlers.tests.addTask}/${testId}`, {
        method: 'POST',
        params: {
            key,
        },
        data: task,
    });
}

export async function updateTask(taskId: string, task: ITask, key: string) {
    return fetchBackend<ITask>(`${handlers.tests.updateTask}/${taskId}`, {
        method: 'PATCH',
        params: {
            key,
        },
        data: task,
    });
}

export async function deleteTask(taskId: string, key: string) {
    return fetchBackend<ITask>(`${handlers.tests.getTask}/${taskId}`, {
        method: 'DELETE',
        params: {
            key,
        },
    });
}
