import {
    AnswersGroups,
    ITask,
} from 'common/types';

import {
    Injectable,
} from '@nestjs/common';

import {
    baseTaskPoints,
    taskPointsModifiers,
} from 'common/configs/points';

@Injectable()
export default class PointsService {

    calculateMaxTaskPoint(task: ITask) {
        const {
            answersGroups,
            multipleCorrectAnswers,
        } = task;

        const basePoints = multipleCorrectAnswers ? baseTaskPoints.multiOption : baseTaskPoints.singleOption;
        const answersCount = answersGroups.length;
        const answersGroupsCount: Partial<Record<AnswersGroups, number>> = {};
        answersGroups.forEach((group) => {
            if (answersGroupsCount[group]) {
                answersGroupsCount[group]++;
            } else {
                answersGroupsCount[group] = 1;
            }
        });

        return Math.round(Object.values(AnswersGroups).reduce((points, group) => {
            return points * taskPointsModifiers[group](answersGroupsCount[group] || 1);
        }, basePoints)
            * taskPointsModifiers.total(answersCount));
    }

}
