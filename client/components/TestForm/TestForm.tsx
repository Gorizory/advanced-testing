import './TestForm.scss';

import {
    IProps,
    IState,
} from './TestForm.types';

import b_ from 'b_';
import React, {
    PureComponent,
} from 'react';

const b = b_.with('test-form');

import TasksListForm from 'client/components/TasksListForm/TasksListForm';
import TestNameForm from 'client/components/TestNameForm/TestNameForm';

export default class TestForm extends PureComponent<IProps, IState> {

    render() {
        const {
            test,
            tasks,

            onChangeTestName,
            onCreateTask,
            onChangeTask,
            onDeleteTask,
        } = this.props;

        const testNameFormProps = {
            initialName: test.name,
            onChangeTestName,
        };

        const tasksListFormProps = {
            tasks,
            onCreateTask,
            onChangeTask,
            onDeleteTask,
        };

        return (
            <div className={b()}>
                <div className={b('name')}>
                    <TestNameForm {...testNameFormProps}/>
                </div>
                <div className={b('list')}>
                    <TasksListForm {...tasksListFormProps}/>
                </div>
            </div>
        );
    }

}
