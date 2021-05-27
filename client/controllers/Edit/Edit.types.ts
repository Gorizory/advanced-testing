import {
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
    startCreatingTest: () => Promise<ITest>;
    fetchTest: (testId: string, key: string) => Promise<ITest>;
    updateTest: (testId: string, test: Partial<ITest>, key: string) => Promise<void>;
    fetchTask: (taskId: string, key: string) => Promise<void>;
    createTask: (testId: string, task: ITask, key: string) => Promise<void>;
    updateTask: (taskId: string, task: ITask, key: string) => Promise<void>;
    deleteTask: (taskId: string, key: string) => Promise<void>;
}

export interface IState extends IBaseState {}

