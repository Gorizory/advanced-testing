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
    [AnswersGroups.Correct]: (answersCount: number) => Math.log(answersCount) / Math.log(3) + 1,
    [AnswersGroups.PartiallyCorrect]: (answersCount: number) => Math.log(answersCount) / Math.log(3) + 1,
    [AnswersGroups.Incorrect]: (answersCount: number) => Math.log(answersCount) / Math.log(3) + 1,
    [AnswersGroups.TotallyIncorrect]: () => 1,
    total: (answersCount: number) => Math.log(answersCount) / Math.log(100) + 1,
};
