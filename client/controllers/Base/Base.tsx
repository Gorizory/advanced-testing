import {
    IProps,
    IOwnProps,
    IState,
    IMapStateToProps,
    IMapActionsToProps,
} from './Base.types';
import {
    Controller,
    QueryParam,
    QueryParams,
} from 'client/types/urlBuilder';

import {
    PureComponent,
} from 'react';
import {
    getParam,
    edit,
    pushUrl,
} from 'client/libs/urlBuilder';

export default class BaseController<P extends IProps, S extends IState> extends PureComponent<P, S> {

    constructor(props: P) {
        super(props);
    }

    async componentDidMount() {

    }

    navigateToEdit(testId: string, query?: QueryParams) {
        const url = edit(testId, query);

        return pushUrl(url);
    }

}

export const baseMapStateToProps = (state: any, ownProps: IOwnProps): IMapStateToProps => {
    const {
        location,
        match,
    } = ownProps;

    return {
        debug: getParam(location, QueryParam.Debug) as boolean,

        controller: getParam(location, QueryParam.Controller) as Controller,
        testId: match.params[QueryParam.TestId],
        testKey: getParam(location, QueryParam.Key) as string,
    };
};

export const baseMapActionsToProps = (): IMapActionsToProps => {
    return {};
};
