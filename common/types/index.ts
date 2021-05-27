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

export interface IBaseEntity {
    _id?: string;
    type: EntityTypes,
}

export interface IEvent {
    type: EventTypes;
    timestamp: number;
    value?: any;
}

export interface ITest extends IBaseEntity {
    name?: string;
    taskIds?: string[];
    keyWords?: string[];
    key: string;
}

export interface ILimitedTask extends IBaseEntity {
    question: string;
    answers: string[];
    multipleCorrectAnswers: boolean;
}

export interface ITask extends ILimitedTask {
    keyWords: string[];
    correctAnswers: number[];
}

export interface IResult extends IBaseEntity {
    testId: string;
    answers: string[];
    events: IEvent[];
}

export interface IAnswer extends IBaseEntity {
    taskId: string;
    answers: number[];
    time: number;
    events: IEvent[];
}

export type IEntity = Partial<IBaseEntity | ITest | ITask | IResult>;
