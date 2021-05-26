import React from 'react';
import {
    render,
} from 'react-dom';

import configureStore from 'client/libs/store';
import {
    Provider,
} from '@flexis/redux';

import Loading from 'client/components/Loading/Loading';
import Root from './Root';

(() => {
    document.addEventListener('DOMContentLoaded', () => {

        const store = configureStore({});
        const mount = document.getElementById('mount');

        (window as any).store = store;

        document.title = 'Тест';

        render(<Loading />, mount, () => {
            render((
                <Provider store={store}>
                    <Root />
                </Provider>
            ), mount);
        });
    });
})();
