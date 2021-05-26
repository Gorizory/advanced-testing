import {
    IEntitiesReducer,
} from './Entities.types';

import {
    Reducer,
} from '@flexis/redux';
export default class EntitiesReducer extends Reducer {

    static namespace = 'entities';
    static initialState: IEntitiesReducer = {};

}
