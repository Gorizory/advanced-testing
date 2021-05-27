export enum QueryParam {
    Key = 'key',
    TestId = 'testId',
    Controller = 'controller',
    Debug = 'debug',
}

export enum Controller {
    Edit = 'edit',
    Run = 'run',
    NotFound = '',
}

export type Query = Partial<Record<QueryParam, string>>;
export type QueryParams = Partial<Record<QueryParam, QueryValue>>;
export type QueryValue = symbol
    | string
    | number
    | boolean
    | Controller
;

export interface ICreateUrl {
    pathname: string;
    query: Query;
}

export const SaveParamValue = Symbol('saveParamValue');

// reset when user logout on his own
export const SAVE_COMMON_PARAMS = {
    [QueryParam.Key]: SaveParamValue,
    [QueryParam.TestId]: SaveParamValue,
    [QueryParam.Debug]: SaveParamValue,
};
