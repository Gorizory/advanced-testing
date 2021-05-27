import {
    Controller,
} from 'client/types/urlBuilder';

import {
    RouteComponentProps,
} from 'react-router';

import {
    ILocation,
    IMatchProps,
} from 'client/libs/history';

export interface IProps extends IOwnProps, IMapStateToProps, IMapActionsToProps {}

export interface IOwnProps extends RouteComponentProps<IMatchProps> {
    location: ILocation,
}

export interface IMapStateToProps {
    debug: boolean;

    controller: Controller
    testId: string;
    testKey: string;
}
export interface IMapActionsToProps {}

export interface IState {}

