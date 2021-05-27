import './Edit.scss';

import {
    IProps,
    IOwnProps,
    IState,
    IMapStateToProps,
    IMapActionsToProps,
} from './Edit.types';
import {
    ITask,
    ITest,
} from 'common/types';

import {
    Controller,
    QueryParam,
} from 'client/types/urlBuilder';

import b_ from 'b_';
import React from 'react';
import {
    Connect,
} from '@flexis/redux';

import Loading from 'client/components/Loading/Loading';
import TestForm from 'client/components/TestForm/TestForm';
import BaseController, {
    baseMapStateToProps,
    baseMapActionsToProps,
} from 'client/controllers/Base/Base';
import EntitiesActions from 'client/reducers/Entities/Entities.actions';
import {
    getEntityById,
    getTasksByTestId,
} from 'client/selectors/entities';

const b = b_.with('edit-controller');

class EditController extends BaseController<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.changeTest = this.changeTest.bind(this);
        this.createTask = this.createTask.bind(this);
        this.changeTask = this.changeTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    async componentDidMount() {
        const {
            controller,
            testId,
            testKey,
        } = this.props;

        if (controller !== Controller.Edit || !testId || !testKey) {
            const {
                _id,
                key,
            } = await this.props.startCreatingTest();

            this.navigateToEdit(_id, {
                [QueryParam.Key]: key,
            });
        } else {
            const {
                taskIds,
            } = await this.props.fetchTest(testId, testKey);

            await Promise.all(taskIds.map((taskId) => {
                this.props.fetchTask(taskId, testKey);
            }));
        }
    }

    render() {
        const {
            tasks,
            test,
        } = this.props;

        if (!test || !tasks || test.taskIds.length !== tasks.length) {
            return <Loading/>;
        }

        const testFormProps = {
            test,
            tasks,
            onChangeTestName: (name: string) => this.changeTest({
                name,
            }),
            onCreateTask: this.createTask,
            onChangeTask: this.changeTask,
            onDeleteTask: this.deleteTask,
        };

        return (
            <div className={b()}>
                <div className={b('column')}>
                    <TestForm {...testFormProps}/>
                </div>
            </div>
        );
    }

    private async changeTest(fields: Partial<ITest>) {
        const {
            testId,
            testKey,
        } = this.props;

        await this.props.updateTest(testId, fields, testKey);
    }

    private async createTask(fields: ITask) {
        const {
            testId,
            testKey,
        } = this.props;

        await this.props.createTask(testId, fields, testKey);
    }

    private async changeTask(taskId: string, fields: ITask) {
        const {
            testKey,
        } = this.props;

        delete fields._id;

        await this.props.updateTask(taskId, fields, testKey);
    }

    private async deleteTask(taskId: string) {
        const {
            testKey,
        } = this.props;

        await this.props.deleteTask(taskId, testKey);
    }

}

const mapStateToProps = (state: any, ownProps: IOwnProps): IMapStateToProps => {
    const baseProps = baseMapStateToProps(state, ownProps);

    const {
        entities,
    } = state;
    const {
        testId,
    } = baseProps;
    const test = getEntityById(entities, testId) as ITest;
    const tasks = test ? getTasksByTestId(entities, testId) : [];

    return {
        test,
        tasks,
        ...baseProps,
    };
};

const mapActionsToProps = (state: any): IMapActionsToProps => {
    const entitiesActions: EntitiesActions = state.entities;

    return {
        startCreatingTest: entitiesActions.startCreatingTest,
        fetchTest: entitiesActions.fetchTest,
        updateTest: entitiesActions.updateTest,
        fetchTask: entitiesActions.fetchTask,
        createTask: entitiesActions.createTask,
        updateTask: entitiesActions.updateTask,
        deleteTask: entitiesActions.deleteTask,
        ...baseMapActionsToProps(),
    };
};

export default Connect({
    mapStateToProps,
    mapActionsToProps,
})(EditController);
