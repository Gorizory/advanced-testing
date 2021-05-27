import './Run.scss';

import {
    IProps,
    IOwnProps,
    IState,
    IMapStateToProps,
    IMapActionsToProps,
} from './Run.types';
import {
    EntityTypes,
    EventTypes,
    IEvent,
    ITest,
} from 'common/types';

import _ from 'lodash';
import b_ from 'b_';
import React from 'react';
import {
    Connect,
} from '@flexis/redux';

import Loading from 'client/components/Loading/Loading';
import Task from 'client/components/Task/Task';
import BaseController, {
    baseMapStateToProps,
    baseMapActionsToProps,
} from 'client/controllers/Base/Base';
import EntitiesActions from 'client/reducers/Entities/Entities.actions';
import {
    getEntityById,
    getTasksByTestId,
} from 'client/selectors/entities';

const b = b_.with('run-controller');

class RunController extends BaseController<IProps, IState> {

    private taskEvents: Record<number, IEvent[]> = {};
    private answers: Record<number, number[]> = [];

    constructor(props: IProps) {
        super(props);

        this.state = {
            finished: false,
            taskIndex: null,
            resultId: null,
        };

        this.onStartTest = this.onStartTest.bind(this);
        this.onChangeTask = this.onChangeTask.bind(this);
        this.onFinishTest = this.onFinishTest.bind(this);

        this.addMouseEvent = this.addMouseEvent.bind(this);
    }

    async componentDidMount() {
        const {
            testId,
        } = this.props;

        const {
            taskIds,
        } = await this.props.fetchTest(testId);

        await Promise.all(taskIds.map((taskId) => {
            this.props.fetchTask(taskId);
        }));

        const createdResult = await this.props.createResult(testId);
        this.setState({
            resultId: createdResult._id,
        });
    }

    render() {
        const {
            tasks,
            test,
        } = this.props;
        const {
            finished,
            resultId,
            taskIndex,
        } = this.state;

        if (finished) {
            return (
                <div className={b()}>
                    <div className={b('column')}>
                        <div className={b('title')}>
                            Спасибо за участие в тестировании!
                        </div>
                    </div>
                </div>
            );
        }

        if (!test || !tasks || test.taskIds.length !== tasks.length || !resultId) {
            return <Loading/>;
        }

        if (taskIndex === null) {
            const startButtonProps = {
                className: b('start-button'),
                children: 'Начать тест',
                onClick: this.onStartTest,
            };

            return (
                <div className={b()}>
                    <div className={b('column')}>
                        <div className={b('title')}>
                            {`Тест "${test.name}"`}
                            <button {...startButtonProps}/>
                        </div>
                    </div>
                </div>
            );
        }

        const task = tasks[taskIndex];
        const taskProps = {
            task,
            firstTask: taskIndex === 0,
            lastTask: tasks.length - 1 === taskIndex,
            initialAnswers: this.answers[taskIndex] || [],

            onPrevTask: (answers: number[]) => this.onChangeTask(taskIndex - 1, answers),
            onNextTask: (answers: number[]) => this.onChangeTask(taskIndex + 1, answers),
            onFinishTest: this.onFinishTest,
        };

        return (
            <div
                className={b()}
                onMouseMove={_.throttle(this.addMouseEvent.bind(this, EventTypes.MouseMove), 10)}
                onClick={this.addMouseEvent.bind(this, EventTypes.MouseClick)}
            >
                <div className={b('column')}>
                    <Task {...taskProps}/>
                </div>
            </div>
        );
    }

    private onStartTest() {
        const {
            resultId,
        } = this.state;

        this.taskEvents[0] = [];

        this.setState({
            taskIndex: 0,
        }, () => this.props.addResultEvent(resultId, {
            type: EventTypes.TestStart,
            timestamp: Date.now(),
        }));
    }

    private onChangeTask(nextTaskIndex: number, answers: number[]) {
        const {
            tasks,
        } = this.props;
        const {
            resultId,
            taskIndex,
        } = this.state;

        this.taskEvents[nextTaskIndex] = [];

        const shouldAddAnswer = !_.isEqual(answers, this.answers[taskIndex]);
        this.answers[taskIndex] = answers;

        this.setState({
            taskIndex: nextTaskIndex,
        }, () => {
            Promise.all([
                shouldAddAnswer
                    ? this.props.addAnswer(resultId, {
                        type: EntityTypes.Answer,
                        taskId: tasks[taskIndex]._id,
                        answers,
                        time: 0,
                        events: this.taskEvents[taskIndex],
                    })
                    : Promise.resolve(),
                this.props.addResultEvent(resultId, {
                    type: nextTaskIndex > taskIndex ? EventTypes.NextTask : EventTypes.PreviousTask,
                    timestamp: Date.now(),
                }),
            ]);
        });
    }

    private onFinishTest(answers: number[]) {
        const {
            tasks,
        } = this.props;
        const {
            resultId,
            taskIndex,
        } = this.state;

        const shouldAddAnswer = !_.isEqual(answers, this.answers[taskIndex]);
        this.answers[taskIndex] = answers;

        this.setState({
            finished: true,
        }, () => {
            Promise.all([
                shouldAddAnswer
                    ? this.props.addAnswer(resultId, {
                        type: EntityTypes.Answer,
                        taskId: tasks[taskIndex]._id,
                        answers,
                        time: 0,
                        events: this.taskEvents[taskIndex],
                    })
                    : Promise.resolve(),
                this.props.addResultEvent(resultId, {
                    type: EventTypes.TestFinish,
                    timestamp: Date.now(),
                }),
            ]);

            this.taskEvents[taskIndex] = [];
        });
    }

    private addMouseEvent(eventType: EventTypes, event: React.MouseEvent<HTMLDivElement>) {
        event.persist();
        const {
            taskIndex,
        } = this.state;

        this.taskEvents[taskIndex].push({
            type: eventType,
            timestamp: Date.now(),
            value: {
                x: event.screenX,
                y: event.screenY,
            },
        });
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
        fetchTest: entitiesActions.fetchTest,
        fetchTask: entitiesActions.fetchTask,
        createResult: entitiesActions.createResult,
        addResultEvent: entitiesActions.addResultEvent,
        addAnswer: entitiesActions.addAnswer,
        ...baseMapActionsToProps(),
    };
};

export default Connect({
    mapStateToProps,
    mapActionsToProps,
})(RunController);
