import './Loading.scss';

import React, {
    ReactNode,
} from 'react';
import b_ from 'b_';

interface IMods {
    fill?: boolean;
    transparent?: boolean;
}

interface IProps {
    mods?: IMods;
    children?: ReactNode;
}

const b = b_.with('loading');

export default function Loading(props: IProps) {
    const {
        children = null,
        mods = {},
    } = props;

    return (
        <div className={b(mods)}>
            <div className={b('spinner')} />
            {children}
        </div>
    );
}
