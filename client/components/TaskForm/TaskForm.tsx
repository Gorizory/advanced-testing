import './TaskForm.scss';

import {
    IProps,
    IState,
} from './TaskForm.types';

import b_ from 'b_';
import React, {
    ChangeEvent,
    PureComponent,
} from 'react';

const b = b_.with('task-form');

export default class TaskForm extends PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        const {
            task: {
                question,
                answers,
                correctAnswers,
                multipleCorrectAnswers,
            },
            startEditing,
        } = props;

        this.state = {
            editing: startEditing,

            currentQuestion: question,
            currentAnswers: answers,
            currentCorrectAnswers: correctAnswers,
            currentMultipleCorrectAnswers: multipleCorrectAnswers,
        };

        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeMultipleCorrectAnswers = this.onChangeMultipleCorrectAnswers.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.onChangeCorrectAnswer = this.onChangeCorrectAnswer.bind(this);
        this.onAddAnswer = this.onAddAnswer.bind(this);
        this.onRemoveAnswer = this.onRemoveAnswer.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    render() {
        const {
            editing,

            currentQuestion,
            currentAnswers,
            currentCorrectAnswers,
            currentMultipleCorrectAnswers,
        } = this.state;

        const multipleAnswersProps = {
            type: 'checkbox',
            disabled: !editing,
            checked: currentMultipleCorrectAnswers,
            onChange: this.onChangeMultipleCorrectAnswers,
        };

        const editTaskButtonProps = {
            className: b('button'),
            children: 'Изменить',
            onClick: this.onEdit,
        };

        if (!editing) {
            return (
                <div className={b()}>
                    <div className={b('header')}>
                        <div className={b('question')}>
                            {currentQuestion}
                        </div>
                        <div className={b('multiple')}>
                            <input {...multipleAnswersProps}/>
                            Несколько правильных ответов
                        </div>
                    </div>
                    {currentAnswers.map((answer, index) => {
                        const correctAnswerProps = {
                            type: currentMultipleCorrectAnswers ? 'checkbox' : 'radio',
                            disabled: true,
                            checked: currentCorrectAnswers.includes(index),
                            onChange: () => this.onChangeCorrectAnswer(index),
                        };

                        return (
                            <div
                                key={index}
                                className={b('answer')}
                            >
                                <input {...correctAnswerProps}/>
                                <div>
                                    {answer}
                                </div>
                            </div>
                        );
                    })}
                    <div
                        className={b('footer', {
                            'right-aligned': true,
                        })}
                    >
                        <button {...editTaskButtonProps}/>
                    </div>
                </div>
            );
        }

        const questionInputProps = {
            className: b('input'),
            value: currentQuestion,
            placeholder: 'Вопрос',
            onChange: this.onChangeQuestion,
        };

        const addAnswerButtonProps = {
            className: b('button'),
            children: 'Добавить ответ',
            onClick: this.onAddAnswer,
        };

        const deleteTaskButtonProps = {
            className: b('button'),
            children: 'Удалить',
            onClick: this.props.onDelete,
        };

        const saveTaskButtonProps = {
            className: b('button'),
            children: 'Сохранить',
            disabled: !currentQuestion || currentAnswers.length < 1 || !currentAnswers.every(Boolean) || !currentCorrectAnswers.length,
            onClick: this.onSave,
        };

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <div className={b('question')}>
                        <input {...questionInputProps}/>
                    </div>
                    <div className={b('multiple')}>
                        <input {...multipleAnswersProps}/>
                        Несколько правильных ответов
                    </div>
                </div>
                {currentAnswers.map((answer, index) => {
                    const correctAnswerProps = {
                        type: currentMultipleCorrectAnswers ? 'checkbox' : 'radio',
                        checked: currentCorrectAnswers.includes(index),
                        onChange: () => this.onChangeCorrectAnswer(index),
                    };

                    const answerInputProps = {
                        className: b('input'),
                        value: answer,
                        onChange: (event: ChangeEvent<HTMLInputElement>) => this.onChangeAnswer(index, event),
                    };

                    const deleteAnswerButtonProps = {
                        className: b('button'),
                        children: 'Удалить ответ',
                        onClick: () => this.onRemoveAnswer(index),
                    };

                    return (
                        <div
                            key={index}
                            className={b('answer')}
                        >
                            <input {...correctAnswerProps}/>
                            <div className={b('answer')}>
                                <input {...answerInputProps}/>
                                <button {...deleteAnswerButtonProps}/>
                            </div>
                        </div>
                    );
                })}
                <div className={b('footer')}>
                    <button {...addAnswerButtonProps}/>
                    <div className={b('footer', {
                        'right-aligned': true,
                    })}>
                        <button {...deleteTaskButtonProps}/>
                        <button {...saveTaskButtonProps}/>
                    </div>
                </div>
            </div>
        );
    }

    private onChangeQuestion(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            currentQuestion: event.target.value,
        });
    }

    private onChangeMultipleCorrectAnswers() {
        const {
            currentMultipleCorrectAnswers,
            currentCorrectAnswers,
        } = this.state;

        const updatedMultipleCorrectAnswers = !currentMultipleCorrectAnswers;

        this.setState({
            currentMultipleCorrectAnswers: updatedMultipleCorrectAnswers,
            currentCorrectAnswers: updatedMultipleCorrectAnswers ? currentCorrectAnswers : currentCorrectAnswers.slice(0, 1),
        });
    }

    private onChangeAnswer(index: number, event: ChangeEvent<HTMLInputElement>) {
        const {
            currentAnswers,
        } = this.state;

        currentAnswers[index] = event.target.value;
        this.setState({
            currentAnswers: [
                ...currentAnswers,
            ],
        });
    }

    private onChangeCorrectAnswer(index: number) {
        const {
            currentCorrectAnswers,
            currentMultipleCorrectAnswers,
        } = this.state;

        if (!currentMultipleCorrectAnswers) {
            return this.setState({
                currentCorrectAnswers: [index],
            });
        }

        if (currentCorrectAnswers.includes(index)) {
            this.setState({
                currentCorrectAnswers: currentCorrectAnswers.filter((v) => v !== index),
            });
        } else {
            this.setState({
                currentCorrectAnswers: [
                    ...currentCorrectAnswers,
                    index,
                ],
            });
        }
    }

    private onAddAnswer() {
        this.setState(({currentAnswers}) => ({
            currentAnswers: [
                ...currentAnswers,
                '',
            ],
        }));
    }

    private onRemoveAnswer(index: number) {
        const {
            currentAnswers,
            currentCorrectAnswers,
        } = this.state;

        this.setState({
            currentAnswers: currentAnswers.filter((_, i) => i !== index),
            currentCorrectAnswers: currentCorrectAnswers.filter((i) => i !== index),
        });
    }

    private onEdit() {
        this.setState({
            editing: true,
        });
    }

    private async onSave() {
        const {
            currentQuestion,
            currentAnswers,
            currentCorrectAnswers,
            currentMultipleCorrectAnswers,
        } = this.state;

        await this.props.onSave({
            ...this.props.task,
            question: currentQuestion,
            answers: currentAnswers,
            correctAnswers: currentCorrectAnswers,
            multipleCorrectAnswers: currentMultipleCorrectAnswers,
        });

        if (this.props.task._id) {
            this.setState({
                editing: false,
            });
        }
    }

}
