import './TaskForm.scss';

import {
    IProps,
    IState,
} from './TaskForm.types';

import {
    AnswersGroups,
} from 'common/types';

import b_ from 'b_';
import React, {
    ChangeEvent,
    PureComponent,
} from 'react';

const b = b_.with('task-form');

const answersGroupsMap = {
    [AnswersGroups.Correct]: 'Верный ответ',
    [AnswersGroups.PartiallyCorrect]: 'Частично верный ответ',
    [AnswersGroups.Incorrect]: 'Неверный ответ',
    [AnswersGroups.TotallyIncorrect]: 'Полностью неверный ответ',
};

export default class TaskForm extends PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        const {
            task: {
                question,
                answers,
                answersGroups,
                correctAnswers,
                multipleCorrectAnswers,
            },
            startEditing,
        } = props;

        this.state = {
            editing: startEditing,

            currentQuestion: question,
            currentAnswers: answers,
            currentAnswersGroups: answersGroups,
            currentCorrectAnswers: correctAnswers,
            currentMultipleCorrectAnswers: multipleCorrectAnswers,
        };

        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeMultipleCorrectAnswers = this.onChangeMultipleCorrectAnswers.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.onChangeAnswerGroup = this.onChangeAnswerGroup.bind(this);
        this.onChangeCorrectAnswer = this.onChangeCorrectAnswer.bind(this);
        this.onChangeAnswersOrder = this.onChangeAnswersOrder.bind(this);
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
            currentAnswersGroups,
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
                                    {`${answer} | ${answersGroupsMap[currentAnswersGroups[index]]}`}
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
                    const arrowUpProps = {
                        className: b('arrow', {
                            up: true,
                        }),
                        onClick: () => this.onChangeAnswersOrder(index),
                    };

                    const arrowDownProps = {
                        className: b('arrow', {
                            down: true,
                        }),
                        onClick: () => this.onChangeAnswersOrder(index, false),
                    };

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

                    const answerGroupSelectProps = {
                        className: b('select'),
                        size: 1,
                        value: currentAnswersGroups[index],
                        disabled: currentAnswersGroups[index] === AnswersGroups.Correct,
                        onChange: (evt: ChangeEvent<HTMLSelectElement>) => this.onChangeAnswerGroup(index, evt),
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
                            <div className={b('arrows')}>
                                <div {...arrowUpProps}/>
                                <div {...arrowDownProps}/>
                            </div>
                            <input {...correctAnswerProps}/>
                            <div className={b('answer')}>
                                <input {...answerInputProps}/>
                                <select {...answerGroupSelectProps}>
                                    {currentAnswersGroups[index] !== AnswersGroups.Correct
                                        ? Object.values(AnswersGroups).map((answersGroup) => {
                                            if (answersGroup === AnswersGroups.Correct) {
                                                return null;
                                            }

                                            const optionProps = {
                                                key: answersGroup,
                                                value: answersGroup,
                                                children: answersGroupsMap[answersGroup],
                                            };

                                            return (
                                                // eslint-disable-next-line react/jsx-key
                                                <option {...optionProps}/>
                                            );
                                        })
                                        : (
                                            <option>
                                                {answersGroupsMap[AnswersGroups.Correct]}
                                            </option>
                                        )
                                    }
                                </select>
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
            currentAnswersGroups,
            currentCorrectAnswers,
        } = this.state;

        const updatedMultipleCorrectAnswers = !currentMultipleCorrectAnswers;
        const updatedCorrectAnswers = updatedMultipleCorrectAnswers ? currentCorrectAnswers : currentCorrectAnswers.slice(0, 1);

        this.setState({
            currentMultipleCorrectAnswers: updatedMultipleCorrectAnswers,
            currentAnswersGroups: updatedMultipleCorrectAnswers ? currentAnswersGroups : currentAnswersGroups.map((value, index) =>
                value !== AnswersGroups.Correct
                    ? value
                    : index === updatedCorrectAnswers[0]
                        ? AnswersGroups.Correct
                        : AnswersGroups.Incorrect),
            currentCorrectAnswers: updatedCorrectAnswers,
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

    private onChangeAnswerGroup(index: number, event: ChangeEvent<HTMLSelectElement>) {
        const {
            currentAnswersGroups,
        } = this.state;

        const updatedAnswersGroups = [
            ...currentAnswersGroups,
        ];
        updatedAnswersGroups[index] = event.target.value as AnswersGroups;

        this.setState({
            currentAnswersGroups: updatedAnswersGroups,
        });
    }

    private onChangeCorrectAnswer(index: number) {
        const {
            currentAnswersGroups,
            currentCorrectAnswers,
            currentMultipleCorrectAnswers,
        } = this.state;

        if (!currentMultipleCorrectAnswers) {
            return this.setState({
                currentAnswersGroups: currentAnswersGroups.map((value, i) =>
                    i === index
                        ? AnswersGroups.Correct
                        : value === AnswersGroups.Correct
                            ? AnswersGroups.Incorrect
                            : value),
                currentCorrectAnswers: [index],
            });
        }

        if (currentCorrectAnswers.includes(index)) {
            this.setState({
                currentAnswersGroups: currentAnswersGroups.map((value, i) => i === index
                    ? AnswersGroups.Incorrect
                    : value),
                currentCorrectAnswers: currentCorrectAnswers.filter((v) => v !== index),
            });
        } else {
            this.setState({
                currentAnswersGroups: currentAnswersGroups.map((value, i) => i === index
                    ? AnswersGroups.Correct
                    : value),
                currentCorrectAnswers: [
                    ...currentCorrectAnswers,
                    index,
                ],
            });
        }
    }

    private onChangeAnswersOrder(index: number, up = true) {
        const {
            currentAnswers,
            currentAnswersGroups,
            currentCorrectAnswers,
        } = this.state;

        if (up && index === 0) {
            return;
        }
        if (!up && index === currentAnswers.length - 1) {
            return;
        }

        const [
            updatedAnswers,
            updatedAnswersGroups,
        ] = [
            currentAnswers,
            currentAnswersGroups,
        ].map((array) => {
            const element = array.splice(index, 1);
            const newIndex = up
                ? index - 1
                : index + 1;
            array.splice(newIndex, 0, element[0]);

            return array;
        });

        const updatedCorrectAnswers = currentCorrectAnswers.map((i) => {
            switch (i) {
                case (index - 1):
                    return up
                        ? i + 1
                        : i;

                case (index):
                    return up
                        ? i - 1
                        : i + 1;

                case (index + 1):
                    return up
                        ? i
                        : i - 1;

                default:
                    return i;
            }
        });

        this.setState({
            currentAnswers: updatedAnswers,
            currentAnswersGroups: updatedAnswersGroups as AnswersGroups[],
            currentCorrectAnswers: updatedCorrectAnswers,
        });
    }

    private onAddAnswer() {
        this.setState(({currentAnswers, currentAnswersGroups}) => ({
            currentAnswers: [
                ...currentAnswers,
                '',
            ],
            currentAnswersGroups: [
                ...currentAnswersGroups,
                AnswersGroups.Incorrect,
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
            currentAnswersGroups,
            currentCorrectAnswers,
            currentMultipleCorrectAnswers,
        } = this.state;

        await this.props.onSave({
            ...this.props.task,
            question: currentQuestion,
            answers: currentAnswers,
            answersGroups: currentAnswersGroups,
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
