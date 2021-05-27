import {
    Controller,
    ICreateUrl,
    Query,
    QueryParams,
    QueryParam,
    SaveParamValue,
    SAVE_COMMON_PARAMS,
    QueryValue,
} from 'client/types/urlBuilder';

import _ from 'lodash';
import {
    parse,
    stringify,
} from 'querystring';

import router, {
    ILocation,
} from 'client/libs/history';

function createUrl(parts: string[], query: QueryParams = {}, hideUselessParams?: boolean): ICreateUrl {
    const currentLocation: ILocation = router.getCurrentLocation();
    const currentQuery = currentLocation.query;
    // We need leading slash to prevent double `propsReceiving in components`
    // Because react-router tries to add slash by himself and makes two transitions: (PUSH → POP, POP → PUSH)
    const pathname = ['/'].concat(parts)
        .filter(Boolean)
        .join('/')
        .replace(/\/{2,}/g, '/');

    return {
        pathname,
        query: prepareQuery(
            currentQuery,
            {
                ...getSaveParams(parts[0] as Controller),
                ...query,
            },
            hideUselessParams,
        ),
    };
}

export function prepareQuery(currentQuery: Query, newQuery: QueryParams, hideUselessParams: boolean = true): Query {
    return Object.entries(newQuery).reduce((query: Query, keyValue) => {
        const [
            param,
            value,
        ] = keyValue as [QueryParam, QueryValue];

        let nextValue = value !== SaveParamValue
            ? value
            : typeof currentQuery[param] !== 'undefined'
                ? currentQuery[param]
                : null;

        if (Array.isArray(nextValue)) {
            nextValue = nextValue.join(',');
        } else if (_.isPlainObject(nextValue)) {
            nextValue = JSON.stringify(nextValue);
        }

        if (hideUselessParams && nextValue === null) {
            return query;
        }

        query[param] = String(nextValue);
        return query;
    }, {});
}

export function create(query: QueryParams = {}) {
    return createUrl(['create'], query);
}

export function edit(testId: string, query: QueryParams = {}) {
    return createUrl([Controller.Edit, testId], query);
}

export function run(testId: string, query: QueryParams = {}) {
    return createUrl([Controller.Run, testId], query);
}

/**
 * Get controller|projectId|documentId|versionId|taskId from location path
 * Get query params from location query object
 */
export function getParam(location: ILocation, param: QueryParam) {
    const {
        query = {},
        pathname = '',
    } = location;

    switch (param) {
        case QueryParam.Controller:
            return getControllerType(pathname) || getParamDefaultValue(param);

        case QueryParam.Key:
            return typeof query[param] === 'string'
                ? query[param]
                : getParamDefaultValue(param);

        case QueryParam.Debug: {
            return query[param] === 'true'
                ? true
                : getParamDefaultValue(param);
        }

        default:
            return typeof query[param] === 'string'
                ? query[param]
                : getParamDefaultValue(param);
    }
}

export function getParamDefaultValue(param: QueryParam = null) {
    switch (param) {
        case QueryParam.Controller:
            return Controller.NotFound;

        case QueryParam.Key:
            return '';

        case QueryParam.Debug:
            return false;

        default:
            return null;
    }
}

export function toString(to: ICreateUrl, skipBaseUrl = true) {
    const baseUrl = !skipBaseUrl
        ? window.location.origin
        : '';
    const query = to.query ? stringify(to.query) : '';

    return `${baseUrl}${to.pathname}${query.length ? `?${query}` : ''}`;
}

/**
 * Convert search to object
 * ...?customKey=customValue -> {customKey: 'customValue'}
 */
export function convertSearchToObject(search: string = document.location.search) {
    return parse(search.replace(/^[^?]*\?/, '')) || {};
}

/** Get params from search object */
export function getFromSearch(key: QueryParam, search?: string) {
    return convertSearchToObject(search)[key] || null;
}

export function getBaseHostname(hostname: string) {
    return hostname.split('.').slice(-2).join('.');
}

/** Hardly replace current path with given one */
export function redirect(path: ICreateUrl | string) {
    // Check if we are not at given url
    const currentLocation = toString(router.getCurrentLocation());
    const pathname = typeof path === 'string'
        ? path
        : path.pathname;

    if (!currentLocation.startsWith(pathname)) {
        router.push(path as any);
    }
}

export function pushUrl(path: ICreateUrl) {
    return router.push(path);
}

export function replaceUrl(path: ICreateUrl) {
    return router.replace(path);
}

export function hardReload() {
    window.location.reload(true);
}

/**
 * Return pathname without documentVersionId and taskId
 * @param pathname (example: /canvas/projectId/documentId)
 */
export function getBaseCanvasPathname(pathname: string) {
    return pathname
        .split('/')
        .slice(0, 3)
        .join('/');
}

/**
 * Return controller type
 * @param pathname (example: /canvas/projectId/documentId --> canvas, navigator/projectId --> navigator)
 */
export function getControllerType(pathname: string) {
    return pathname
        .replace(/^\//, '')
        .split('/')[0];
}

export function navigateToUrl(url: string, target: string = '_blank') {
    window.open(url, target);
}

function getSaveParams(controller: Controller) {
    switch (controller) {
        default:
            return SAVE_COMMON_PARAMS;
    }
}
