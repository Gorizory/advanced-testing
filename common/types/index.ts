export enum EntityTypes {
    Test = 'TEST',
    Task = 'TASK',
    Result = 'RESULT',
    Answer = 'ANSWER',
}

export enum EventTypes {
    // global events
    ResultCreated = 'RESULT_CREATED',
    TestStart = 'TEST_START',
    TestFinish = 'TEST_FINISH',
    NextTask = 'NEXT_TASK',
    PreviousTask = 'PREVIOUS_TASK',

    // local events
    RadioChecked = 'RADIO_CHECKED',
    CheckboxChecked = 'CHECKBOX_CHECKED',
    CheckboxUnchecked = 'CHECKBOX_UNCHECKED',
    MouseMove = 'MOUSE_MOVE',
    MouseClick = 'MOUSE_CLICK',
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
    answerIds: string[];
    events: IEvent[];
}

export interface IAnswer extends IBaseEntity {
    taskId: string;
    answers: number[];
    time: number;
    events: IEvent[];
}

export type IEntity = Partial<IBaseEntity | ITest | ITask | IResult | IAnswer>;
