import {
    IEntity,
} from 'common/types';

export type IEntitiesReducer = Record<string, IEntity>;

export type MergeEntityPayload = IEntity;
export interface IMergeEntity {
    payload: MergeEntityPayload;
}
