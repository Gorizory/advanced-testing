import {
    IAnswer,
    IEvent,
    IResult,
    ITask,
    ITest,
} from 'common/types';
import {
    IProps as IBaseProps,
    IOwnProps as IBaseOwnProps,
    IState as IBaseState,
    IMapStateToProps as IBaseMapStateToProps,
    IMapActionsToProps as IBaseMapActionsToProps,
} from 'client/controllers/Base/Base.types';

export interface IProps extends IBaseProps, IOwnProps, IMapStateToProps, IMapActionsToProps {}

export interface IOwnProps extends IBaseOwnProps {}

export interface IMapStateToProps extends IBaseMapStateToProps {
    test: ITest,
    tasks: ITask[]
}
export interface IMapActionsToProps extends IBaseMapActionsToProps {
    fetchTest: (testId: string) => Promise<ITest>;
    fetchTask: (taskId: string) => Promise<void>;
    createResult: (testId: string) => Promise<IResult>;
    addResultEvents: (resultId: string, events: IEvent[]) => Promise<void>;
    addAnswer: (resultId: string, answer: IAnswer, events: IEvent[]) => Promise<void>;
}

export interface IState extends IBaseState {
    finished: boolean;
    taskIndex: number;
    resultId: string;
}

