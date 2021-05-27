import {
    ITask,
    ITest,
} from 'common/types';
import {
    IEntitiesReducer,
} from 'client/reducers/Entities/Entities.types';

import {
    createSelector,
} from 'reselect';

export const getEntitiesSelector = (state: IEntitiesReducer) => state;
export const getEntityById = (state: IEntitiesReducer, entityId: string) => state[entityId];

export const getTasksByTestId = createSelector(
    [
        (state: any, testId: string) => state[testId],
        getEntitiesSelector,
    ],
    (test: ITest, entities): ITask[] =>
        test.taskIds
            .map((id) => entities[id] as ITask)
            .filter(Boolean),
);
