import {
    ITask,
} from 'common/types';

export interface IProps {
    tasks: ITask[],
    onCreateTask: (task: Partial<ITask>) => void;
    onChangeTask: (taskId: string, task: Partial<ITask>) => void;
    onDeleteTask: (taskId: string) => void;
}

export interface IState {
    creatingTask: boolean;
}
