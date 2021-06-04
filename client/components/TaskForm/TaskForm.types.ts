import {
    AnswersGroups,
    ITask,
} from 'common/types';

export interface IProps {
    task: ITask;
    startEditing?: boolean;

    onDelete: () => void;
    onSave: (task: ITask) => void;
}

export interface IState {
    editing: boolean;

    currentQuestion: string;
    currentAnswers: string[]
    currentAnswersGroups: AnswersGroups[];
    currentCorrectAnswers: number[];
    currentMultipleCorrectAnswers: boolean;
}
