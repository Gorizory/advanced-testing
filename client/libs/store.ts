import Store, {
    ImmerAdapter,
} from '@flexis/redux';
import {
    StoreEnhancer,
    applyMiddleware,
    compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {
    createLogger,
} from 'redux-logger';

import {
    IS_DEVELOPMENT,
} from 'common/libs/env';

import EntitiesActions from 'client/reducers/Entities/Entities.actions';
import EntitiesReducer from 'client/reducers/Entities/Entities.reducer';

export function createEnhacner(): StoreEnhancer {
    const win = window as any;
    const devTool = typeof win !== 'undefined' && win.devToolsExtension && IS_DEVELOPMENT
        ? win.devToolsExtension()
        : (_: any) => _;

    return compose(
        applyMiddleware.apply(applyMiddleware, [
            thunkMiddleware,
            promiseMiddleware,
            IS_DEVELOPMENT && createLogger({
                collapsed: true,
                duration: true,
                timestamp: true,
                logErrors: true,
                diff: true,
            }),
        ].filter(Boolean)),
        devTool,
    );
}

export default function configureStore(initialState: any) {
    return new Store({
        adapter: ImmerAdapter,
        state: initialState,
        actions: [
            EntitiesActions,
        ],
        reducer: [
            EntitiesReducer,
        ],
        enhancer: createEnhacner(),
    });
}
