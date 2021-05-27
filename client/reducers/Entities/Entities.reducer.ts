import {
    IEntitiesReducer,
    IMergeEntity,
} from './Entities.types';

import {
    Reducer,
} from '@flexis/redux';

export default class EntitiesReducer extends Reducer {

    static namespace = 'entities';
    static initialState: IEntitiesReducer = {};

    mergeEntity(draft: IEntitiesReducer, {payload: entity}: IMergeEntity) {
        const _id = entity._id;
        if (!draft[_id]) {
            draft[_id] = {
                _id,
            };
        }
        draft[_id] = {
            ...draft[_id],
            ...entity,
        };
    }

    clear(draft: IEntitiesReducer) {
        Object.keys(draft).forEach(id => delete draft[id]);
    }

}
