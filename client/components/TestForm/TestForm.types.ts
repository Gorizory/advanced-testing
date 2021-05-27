import {
    ITest,
    ITask,
} from 'common/types';

export interface IProps {
    test: ITest,
    tasks: ITask[],
    onChangeTestName: (name: string) => void;
    onCreateTask: (task: Partial<ITask>) => void;
    onChangeTask: (taskId: string, task: Partial<ITask>) => void;
    onDeleteTask: (taskId: string) => void;
}

export interface IState {}
