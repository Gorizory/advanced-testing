import {
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
    currentCorrectAnswers: number[];
    currentMultipleCorrectAnswers: boolean;
}
