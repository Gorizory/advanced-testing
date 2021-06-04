import './TasksListForm.scss';

import {
    IProps,
    IState,
} from './TasksListForm.types';
import {
    AnswersGroups,
    EntityTypes,
    ITask,
} from 'common/types';

import b_ from 'b_';
import React, {
    PureComponent,
} from 'react';

const b = b_.with('tasks-list-form');

import TaskForm from 'client/components/TaskForm/TaskForm';

export default class TasksListForm extends PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            creatingTask: false,
        };
    }

    render() {
        const {
            tasks,

            onCreateTask,
            onChangeTask,
            onDeleteTask,
        } = this.props;

        const {
            creatingTask,
        } = this.state;

        const newTaskProps = {
            task: {
                type: EntityTypes.Task,
                question: '',
                answers: ['', ''],
                answersGroups: [AnswersGroups.Incorrect, AnswersGroups.Incorrect],
                correctAnswers: [] as number[],
                keyWords: [] as string[],
                multipleCorrectAnswers: false,
            },
            startEditing: true,

            onDelete: () => this.setState({
                creatingTask: false,
            }),
            onSave: (task: ITask) => {
                this.setState({
                    creatingTask: false,
                });
                onCreateTask(task);
            },
        };

        const addTaskButtonProps = {
            className: b('button'),
            onClick: () => this.setState({
                creatingTask: true,
            }),
        };

        return (
            <div className={b()}>
                {tasks.map((task) => {
                    const taskFormProps = {
                        task,

                        onSave: (updatedTask: ITask) => onChangeTask(task._id, updatedTask),
                        onDelete: () => onDeleteTask(task._id),
                    };

                    return (
                        <div
                            key={task._id}
                            className={b('task')}
                        >
                            <TaskForm {...taskFormProps}/>
                        </div>
                    );
                })}
                {creatingTask && (
                    <div className={b('task')}>
                        <TaskForm {...newTaskProps}/>
                    </div>
                )}
                {!creatingTask && (
                    <div className={b('footer')}>
                        <button {...addTaskButtonProps}>
                            Добавить задачу
                        </button>
                    </div>
                )}
            </div>
        );
    }

}
