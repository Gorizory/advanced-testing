import {
    AnswersGroups,
} from 'common/types';

// Base points
export const baseTaskPoints = {
    singleOption: 10,
    multiOption: 15,
};

// Task max points modifiers
export const taskPointsModifiers = {
    [AnswersGroups.Correct]: (answersCount: number) => 1 / (1 + Math.exp(-0.4 * (answersCount - 10))) + 1,
    [AnswersGroups.PartiallyCorrect]: (answersCount: number) => 1 / (1 + Math.exp(-0.4 * (answersCount - 10))) + 1,
    [AnswersGroups.Incorrect]: (answersCount: number) => 1 / (1 + Math.exp(-0.4 * (answersCount - 10))) + 1,
    [AnswersGroups.TotallyIncorrect]: () => 1,
    total: (answersCount: number) => 1 / (1 + Math.exp(-0.25 * (answersCount - 20))) + 1,
};
