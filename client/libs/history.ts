import {
    Query,
    QueryParam,
} from 'client/types/urlBuilder';

import {
    History,
    LocationState,
    Location,
    createBrowserHistory,
} from 'history';

import historyWithQuery from 'qhistory';
import {
    parse,
    stringify,
} from 'querystring';

export interface ILocation<S = LocationState> extends Location<S> {
    query: Query;
}

export interface IMatchProps {
    [QueryParam.TestId]: string;
}

export interface IHistory<HistoryLocationState = LocationState> extends History<HistoryLocationState> {
    location: ILocation<HistoryLocationState>;
    getCurrentLocation: Function;
}

let userConfirmation: Function = null;

export function setUserConfirmation(_: Function) {
    userConfirmation = _;
}

function getUserConfirmation(message: string, callback: (result: boolean) => void) {
    if (typeof userConfirmation === 'function') {
        userConfirmation(message).then(callback);
    }
}

const history = historyWithQuery(
    createBrowserHistory({
        getUserConfirmation,
    }),
    stringify,
    parse,
) as IHistory;

history.getCurrentLocation = function() {
    const {
        pathname,
        query,
    } = this.location;

    return {
        pathname,
        query,
    };
};

export default history;
