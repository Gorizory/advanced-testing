export enum EntityTypes {
    Test = 'TEST',
    Task = 'TASK',
    Result = 'RESULT',
    Answer = 'ANSWER',
}

export enum EventTypes {
    TestStart = 'TEST_START',
    TestFinish = 'TEST_FINISH',
    NextQuestion = 'NEXT_QUESTION',
    PreviousQuestion = 'PREVIOUS_QUESTION',
}

export interface IEntity {
    _id?: string;
    type: EntityTypes,
}

export interface IEvent {
    type: EventTypes;
    timestamp: number;
    value?: any;
}

export interface ITest extends IEntity {
    taskIds: string[];
    keyWords: string[];
    isFinished: boolean;
}

export interface ILimitedTask extends IEntity {
    question: string;
    answers: string[];
    multipleCorrectAnswers: boolean;
}

export interface ITask extends ILimitedTask {
    keyWords: string[];
    correctAnswers: number[];
}

export interface IResult extends IEntity {
    testId: string;
    answers: string[];
    events: IEvent[];
}

export interface IAnswer extends IEntity {
    taskId: string;
    answers: number[];
    time: number;
    events: IEvent[];
}

export type Entities = Partial<IEntity | ITest | ITask | IResult>;
