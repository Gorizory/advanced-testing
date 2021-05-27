import './TestNameForm.scss';

import {
    IProps,
    IState,
} from './TestNameForm.types';

import b_ from 'b_';
import React, {
    ChangeEvent,
    PureComponent,
} from 'react';

const b = b_.with('test-name-form');

export default class TestNameForm extends PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            currentName: props.initialName,
            changingName: !props.initialName,
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onSaveName = this.onSaveName.bind(this);
    }

    render() {
        const {
            currentName,
            changingName,
        } = this.state;

        if (!changingName) {
            const buttonProps = {
                className: b('button'),
                children: 'Изменить',
                onClick: () => this.setState({
                    changingName: true,
                }),
                disabled: !currentName,
            };

            return (
                <div className={b()}>
                    <div className={b('name')}>
                        {currentName}
                    </div>
                    <button {...buttonProps}/>
                </div>
            );
        }

        const inputProps = {
            className: b('input'),
            value: currentName,
            placeholder: 'Название теста',
            onChange: this.onChangeValue,
        };

        const buttonProps = {
            className: b('button'),
            children: 'Сохранить',
            onClick: this.onSaveName,
            disabled: !currentName,
        };

        return (
            <div className={b()}>
                <input {...inputProps}/>
                <button {...buttonProps}/>
            </div>
        );
    }

    private onChangeValue(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            currentName: event.target.value,
        });
    }

    private async onSaveName() {
        const {
            currentName,
        } = this.state;

        await this.props.onChangeTestName(currentName);

        this.setState({
            changingName: false,
        });
    }

}
