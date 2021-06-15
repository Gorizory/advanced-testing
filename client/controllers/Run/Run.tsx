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

const CONSOLE_HEIGHT_OPENED = 0.8;
const CONSOLE_WIDTH_OPENED = 1;

class RunController extends BaseController<IProps, IState> {

    private taskEvents: Record<number, IEvent[]> = {};
    private globalEvents: IEvent[] = [];
    private answers: Record<number, number[]> = [];
    private taskStartTime: number = null;

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

        this.addTaskEvent = this.addTaskEvent.bind(this);
        this.addMouseEvent = this.addMouseEvent.bind(this);
        this.onResize = _.throttle(this.onResize.bind(this), 100);
        this.checkWindowSize = this.checkWindowSize.bind(this);
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

        this.checkWindowSize();
        window.addEventListener('resize', this.onResize, true);
        window.onfocus = () => this.globalEvents.push({
            type: EntityTypes.GlobalEvent,
            eventType: EventTypes.FocusIn,
            resultId: createdResult._id,
            timestamp: Date.now(),
        });
        window.onblur = () => this.globalEvents.push({
            type: EntityTypes.GlobalEvent,
            eventType: EventTypes.FocusOut,
            resultId: createdResult._id,
            timestamp: Date.now(),
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, true);
        window.onfocus = () => {};
        window.onblur = () => {};
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

            addEvent: this.addTaskEvent,
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
        this.taskStartTime = Date.now();

        this.setState({
            taskIndex: 0,
        }, () => this.props.addResultEvents(resultId, [
            {
                type: EntityTypes.GlobalEvent,
                eventType: EventTypes.TestStart,
                resultId,
                timestamp: Date.now(),
            },
        ]));
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

        this.answers[taskIndex] = answers;

        const taskTime = Date.now() - this.taskStartTime;
        this.taskStartTime = Date.now();

        this.setState({
            taskIndex: nextTaskIndex,
        }, () => {
            Promise.all([
                _.intersection(this.taskEvents[taskIndex].map(({eventType}) => eventType), [
                    EventTypes.RadioChecked,
                    EventTypes.CheckboxChecked,
                    EventTypes.CheckboxUnchecked,
                ]).length
                    ? this.props.addAnswer(resultId, {
                        type: EntityTypes.Answer,
                        taskId: tasks[taskIndex]._id,
                        answers,
                        time: taskTime,
                    }, this.taskEvents[taskIndex])
                    : Promise.resolve(),
                this.props.addResultEvents(resultId, [
                    {
                        type: EntityTypes.GlobalEvent,
                        eventType: nextTaskIndex > taskIndex ? EventTypes.NextTask : EventTypes.PreviousTask,
                        resultId,
                        timestamp: Date.now(),
                    },
                ]),
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

        this.answers[taskIndex] = answers;

        const taskTime = Date.now() - this.taskStartTime;

        this.setState({
            finished: true,
        }, async () => {
            if (_.intersection(this.taskEvents[taskIndex].map(({eventType}) => eventType), [
                EventTypes.RadioChecked,
                EventTypes.CheckboxChecked,
                EventTypes.CheckboxUnchecked,
            ]).length) {
                await this.props.addAnswer(resultId, {
                    type: EntityTypes.Answer,
                    taskId: tasks[taskIndex]._id,
                    answers,
                    time: taskTime,
                }, this.taskEvents[taskIndex]);
            }

            this.props.addResultEvents(resultId, [
                ...this.globalEvents,
                {
                    type: EntityTypes.GlobalEvent,
                    eventType: EventTypes.TestFinish,
                    resultId,
                    timestamp: Date.now(),
                },
            ]);
        });
    }

    addTaskEvent(eventType: EventTypes, value: string | number) {
        const {
            taskIndex,
            resultId,
        } = this.state;

        this.taskEvents[taskIndex].push({
            type: EntityTypes.TaskEvent,
            eventType,
            resultId,
            timestamp: Date.now(),
            value,
        });
    }

    private addMouseEvent(eventType: EventTypes, event: React.MouseEvent<HTMLDivElement>) {
        const {
            taskIndex,
            resultId,
        } = this.state;

        const id = (event.target as Element).id;

        this.taskEvents[taskIndex].push({
            type: EntityTypes.TaskEvent,
            eventType,
            resultId,
            timestamp: Date.now(),
            value: {
                x: event.screenX,
                y: event.screenY,
                ...(id ? {id} : {}),
            },
        });
    }

    private onResize() {
        const {
            resultId,
        } = this.state;

        this.globalEvents.push({
            type: EntityTypes.GlobalEvent,
            eventType: EventTypes.Resize,
            resultId,
            timestamp: Date.now(),
        });
        this.checkWindowSize();
    }

    private checkWindowSize() {
        if (
            (
                window.innerWidth / window.outerWidth < CONSOLE_WIDTH_OPENED
                || window.innerHeight / window.outerHeight < CONSOLE_HEIGHT_OPENED
            )
            && this.globalEvents.every(({eventType}) => eventType !== EventTypes.ConsoleOpened)
        ) {
            const {
                resultId,
            } = this.state;

            this.globalEvents.push({
                type: EntityTypes.GlobalEvent,
                eventType: EventTypes.ConsoleOpened,
                resultId,
                timestamp: Date.now(),
            });
        }
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
        addResultEvents: entitiesActions.addResultEvents,
        addAnswer: entitiesActions.addAnswer,
        ...baseMapActionsToProps(),
    };
};

export default Connect({
    mapStateToProps,
    mapActionsToProps,
})(RunController);
