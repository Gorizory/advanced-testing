export enum EntityTypes {
    Test = 'TEST',
    Task = 'TASK',
    Result = 'RESULT',
    Answer = 'ANSWER',

    GlobalEvent = 'GLOBAL_EVENT',
    TaskEvent = 'TASK_EVENT',
}

export enum EventTypes {
    // global events
    ResultCreated = 'RESULT_CREATED',
    TestStart = 'TEST_START',
    TestFinish = 'TEST_FINISH',
    NextTask = 'NEXT_TASK',
    PreviousTask = 'PREVIOUS_TASK',

    ConsoleOpened = 'CONSOLE_OPENED',
    Resize = 'RESIZE',
    FocusIn = 'FOCUS_IN',
    FocusOut = 'FOCUS_OUT',

    // local events
    RadioChecked = 'RADIO_CHECKED',
    CheckboxChecked = 'CHECKBOX_CHECKED',
    CheckboxUnchecked = 'CHECKBOX_UNCHECKED',
    MouseMove = 'MOUSE_MOVE',
    MouseClick = 'MOUSE_CLICK',
}

export enum AnswersGroups {
    Correct = 'CORRECT',
    PartiallyCorrect = 'PARTIALLY_CORRECT',
    Incorrect = 'INCORRECT',
    TotallyIncorrect = 'TOTALLY_INCORRECT',
}

export interface IBaseEntity {
    _id?: string;
    type: EntityTypes,
}

export interface ITest extends IBaseEntity {
    name?: string;
    taskIds?: string[];
    keyWords?: string[];
    key: string;
}

export interface ITask extends IBaseEntity {
    question: string;
    answers: string[];
    answersGroups: AnswersGroups[];
    multipleCorrectAnswers: boolean;
    points?: number;
    keyWords?: string[];
    correctAnswers?: number[];
}

export interface IResult extends IBaseEntity {
    testId: string;
    answerIds: string[];
    eventIds?: string[];
    points?: number;
    maxPoints?: number;
    isFinished: boolean;
}

export interface IAnswer extends IBaseEntity {
    taskId: string;
    answers: number[];
    time: number;
    eventIds?: string[];
    points?: number;
}

export interface IEvent extends IBaseEntity {
    eventType: EventTypes;
    resultId: string;
    timestamp: number;
    value?: any;
}

export type IEntity = Partial<IBaseEntity | ITest | ITask | IResult | IAnswer | IEvent>;
