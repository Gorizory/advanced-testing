import {
    EventTypes,
    ITask,
} from 'common/types';

export interface IProps {
    task: ITask;
    firstTask: boolean;
    lastTask: boolean;
    initialAnswers: number[];

    onPrevTask: (answers: number[]) => void;
    onNextTask: (answers: number[]) => void;
    onFinishTest: (answers: number[]) => void;

    addEvent: (eventType: EventTypes, value: number | string) => void;
}

export interface IState {
    answers: number[];
}
