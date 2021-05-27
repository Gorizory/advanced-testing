import {
    QueryParam,
} from 'client/types/urlBuilder';

import React from 'react';
import {
    Router,
    Route,
    Switch,
} from 'react-router';

import history from 'client/libs/history';
import {
    create as createUrl,
    edit as editUrl,
    run as runUrl,
} from 'client/libs/urlBuilder';

import EditController from 'client/controllers/Edit/Edit';
import RunController from 'client/controllers/Run/Run';
import NotFoundController from 'client/controllers/NotFound/NotFound';

const createPath = createUrl().pathname;
const editPath = editUrl(`:${QueryParam.TestId}?`).pathname;
const runPath = runUrl(`:${QueryParam.TestId}?`).pathname;

export default () => (
    <Router history={history}>
        <Switch>
            <Route exact path={createPath} component={EditController} />
            <Route path={editPath} component={EditController} />
            <Route path={runPath} component={RunController} />
            <Route component={NotFoundController} />
        </Switch>
    </Router>
);
