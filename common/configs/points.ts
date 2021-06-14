import {
    AnswersGroups,
} from 'common/types';

// Base points
export const baseTaskPoints = {
    singleOption: 1,
    multiOption: 1.5,
};

// Task max points modifiers
export const taskPointsModifiers = {
    [AnswersGroups.Correct]: (answersCount: number) => 1 / (1 + Math.exp(-0.4 * (answersCount - 10))) + 1,
    [AnswersGroups.PartiallyCorrect]: (answersCount: number) => 1 / (1 + Math.exp(-0.4 * (answersCount - 10))) + 1,
    [AnswersGroups.Incorrect]: (answersCount: number) => 1 / (1 + Math.exp(-0.4 * (answersCount - 10))) + 1,
    [AnswersGroups.TotallyIncorrect]: () => 1,
    total: (answersCount: number) => 1 / (1 + Math.exp(-0.25 * (answersCount - 20))) + 1,
};

// User answer modifiers
export const userAnswerPointsModifiers = {
    singleOption: {
        [AnswersGroups.Correct]: 1,
        [AnswersGroups.PartiallyCorrect]: 0.25,
        [AnswersGroups.Incorrect]: 0,
        [AnswersGroups.TotallyIncorrect]: 0,
    },
};
