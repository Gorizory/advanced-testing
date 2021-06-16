import './Task.scss';

import {
    IProps,
    IState,
} from './Task.types';
import {
    EventTypes,
} from 'common/types';

import b_ from 'b_';
import React, {
    PureComponent,
} from 'react';

const b = b_.with('task');

export default class Task extends PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        const {
            initialAnswers,
        } = props;

        this.state = {
            answers: initialAnswers,
        };

        this.onChangeAnswer = this.onChangeAnswer.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<IProps>) {
        const {
            task: {
                _id: prevTaskId,
            },
        } = prevProps;
        const {
            task: {
                _id: taskId,
            },
            initialAnswers,
        } = this.props;

        if (prevTaskId !== taskId) {
            this.setState({
                answers: initialAnswers,
            });
        }
    }

    render() {
        const {
            task,
            firstTask,
            lastTask,

            onPrevTask,
            onNextTask,
            onFinishTest,
        } = this.props;
        const {
            answers: currentAnswers,
        } = this.state;

        const {
            question,
            answers,
            multipleCorrectAnswers,
        } = task;

        const prevTaskButtonProps = {
            id: 'prev',
            children: 'Предыдущий вопрос',
            onClick: () => onPrevTask(currentAnswers),
        };
        const nextTaskButtonProps = {
            id: 'next',
            children: 'Следующий вопрос',
            disabled: !currentAnswers.length,
            onClick: () => onNextTask(currentAnswers),
        };
        const finishButtonProps = {
            id: 'finish',
            children: 'Закончить тест',
            disabled: !currentAnswers.length,
            onClick: () => onFinishTest(currentAnswers),
        };

        return (
            <div className={b()}>
                <div
                    className={b('header')}
                    id={'task'}
                >
                    <div
                        className={b('question')}
                        id={'task'}
                    >
                        {question}
                    </div>
                </div>
                <div>
                    {answers.map((answer, index) => {
                        const id = index.toString();

                        const correctAnswerProps = {
                            id,
                            type: multipleCorrectAnswers ? 'checkbox' : 'radio',
                            checked: currentAnswers.includes(index),
                            onChange: () => this.onChangeAnswer(index),
                        };

                        return (
                            <div
                                key={index}
                                id={id}
                                className={b('answer')}
                            >
                                <input {...correctAnswerProps}/>
                                <div id={id}>
                                    {answer}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div
                    className={b('footer', {
                        'right-aligned': firstTask,
                    })}
                >
                    {!firstTask && <button {...prevTaskButtonProps}/>}
                    {lastTask
                        ? <button {...finishButtonProps}/>
                        : <button {...nextTaskButtonProps}/>
                    }
                </div>
            </div>
        );
    }

    private onChangeAnswer(index: number) {
        const {
            task: {
                multipleCorrectAnswers,
            },
        } = this.props;
        const {
            answers,
        } = this.state;

        if (!multipleCorrectAnswers) {
            this.props.addEvent(EventTypes.RadioChecked, index);

            return this.setState({
                answers: [index],
            });
        }

        if (answers.includes(index)) {
            this.props.addEvent(EventTypes.CheckboxUnchecked, index);

            this.setState({
                answers: answers.filter((i) => i !== index),
            });
        } else {
            this.props.addEvent(EventTypes.CheckboxChecked, index);

            this.setState({
                answers: [
                    ...answers,
                    index,
                ],
            });
        }
    }

}
