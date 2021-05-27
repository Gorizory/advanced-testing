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
    return fetchBackend<ITask>(`${handlers.tests.deleteTask}/${taskId}`, {
        method: 'DELETE',
        params: {
            key,
        },
    });
}
