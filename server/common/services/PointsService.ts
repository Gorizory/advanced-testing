import {
    AnswersGroups,
    IAnswer,
    ITask,
} from 'common/types';

import {
    Injectable,
} from '@nestjs/common';

import {
    baseTaskPoints,
    taskPointsModifiers,
    userAnswerPointsModifiers,
} from 'common/configs/points';

@Injectable()
export default class PointsService {

    calculateMaxTaskPoints(task: ITask) {
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
            if (!answersGroupsCount[group]) {
                return points;
            }
            return points * taskPointsModifiers[group](answersGroupsCount[group]);
        }, basePoints)
            * taskPointsModifiers.total(answersCount));
    }

    calculateAnswerPointsModifier(answer: IAnswer, task: ITask) {
        const {
            answersGroups,
            multipleCorrectAnswers,
        } = task;
        const {
            answers,
        } = answer;

        if (!multipleCorrectAnswers) {
            return userAnswerPointsModifiers.singleOption[answersGroups[answers[0]]];
        }

        const answersCount = {
            [AnswersGroups.Correct]: answersGroups.filter((v) => v === AnswersGroups.Correct).length,
            [AnswersGroups.PartiallyCorrect]: answersGroups.filter((v) => v === AnswersGroups.PartiallyCorrect).length,
            [AnswersGroups.Incorrect]: answersGroups.filter((v) => v === AnswersGroups.Incorrect).length,
            [AnswersGroups.TotallyIncorrect]: answersGroups.filter((v) => v === AnswersGroups.TotallyIncorrect).length,
        };
        const userAnswersCount = {
            [AnswersGroups.Correct]: answersGroups.filter((v, i) => v === AnswersGroups.Correct && answers.includes(i)).length,
            [AnswersGroups.PartiallyCorrect]: answersGroups.filter((v, i) => v === AnswersGroups.PartiallyCorrect && answers.includes(i)).length,
            [AnswersGroups.Incorrect]: answersGroups.filter((v, i) => v === AnswersGroups.Incorrect && answers.includes(i)).length,
            [AnswersGroups.TotallyIncorrect]: answersGroups.filter((v, i) => v === AnswersGroups.TotallyIncorrect && answers.includes(i)).length,
        };

        const correctAnswersCount = answersCount[AnswersGroups.Correct];
        const correctWeight = 1 / correctAnswersCount;
        const positive = userAnswersCount[AnswersGroups.Correct] * correctWeight;

        const incorrectAnswersCount = answersCount[AnswersGroups.Incorrect] + 1.5 * answersCount[AnswersGroups.TotallyIncorrect];
        let negative;
        if (incorrectAnswersCount) {
            const incorrectWeight = 1 / incorrectAnswersCount;
            negative = userAnswersCount[AnswersGroups.Incorrect] * incorrectWeight + userAnswersCount[AnswersGroups.TotallyIncorrect] * 1.5 * incorrectWeight;
        } else {
            negative = 0;
        }

        const initialResult = positive - negative * (incorrectAnswersCount / correctAnswersCount);

        let finalResult = initialResult;
        const partialAnswersCount = answersCount[AnswersGroups.PartiallyCorrect];
        const partialUserAnswersCount = userAnswersCount[AnswersGroups.PartiallyCorrect];
        if (partialUserAnswersCount) {
            if (initialResult > 0.75) {
                const partialAnswerWeight = (initialResult - 0.75) / partialAnswersCount;
                finalResult = initialResult - partialUserAnswersCount * partialAnswerWeight;
            }
            if (initialResult >= 0 && initialResult < 0.25) {
                const partialAnswerWeight = (0.25 - initialResult) / partialAnswersCount;
                finalResult = initialResult + partialUserAnswersCount * partialAnswerWeight;
            }
        }

        if (finalResult < 0) {
            finalResult = 0;
        }

        return finalResult;
    }

}
