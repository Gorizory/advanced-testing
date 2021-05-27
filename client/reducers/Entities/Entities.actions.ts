import {
    MergeEntityPayload,
} from './Entities.types';
import {
    EntityTypes,
    ITask,
    ITest,
} from 'common/types';

import EntitiesReducer from './Entities.reducer';
import {
    startCreatingTest,
    fetchTest,
    updateTest,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
} from 'client/dataProviders/tests';

export default abstract class EntitiesActions extends EntitiesReducer.Actions {

    async startCreatingTest() {
        const createdTest = Object.values(await startCreatingTest())[0];

        this.mergeEntity(createdTest);

        return createdTest;
    }

    async fetchTest(testId: string, key?: string) {
        const test = Object.values(await fetchTest(testId, key))[0];

        this.mergeEntity(test);

        return test;
    }

    async updateTest(testId: string, test: Partial<ITest>, key: string) {
        const updatedTest = Object.values(await updateTest(testId, test, key))[0];

        this.mergeEntity(updatedTest);
    }

    async fetchTask(taskId: string, key?: string) {
        const task = Object.values(await fetchTask(taskId, key))[0];

        this.mergeEntity(task);
    }

    async createTask(testId: string, task: ITask, key: string) {
        const entities = Object.values(await createTask(testId, task, key));

        this.mergeEntity(entities.find(({type}) => type === EntityTypes.Task));
        this.mergeEntity(entities.find(({_id}) => _id === testId));
    }

    async updateTask(taskId: string, task: ITask, key: string) {
        const updatedTask = Object.values(await updateTask(taskId, task, key))[0];

        this.mergeEntity(updatedTask);
    }

    async deleteTask(taskId: string, key: string) {
        const updatedTest = Object.values(await deleteTask(taskId, key))[0];

        this.mergeEntity(updatedTest);
    }

    abstract mergeEntity(payload: MergeEntityPayload): void;
    abstract clear(): void;

}
