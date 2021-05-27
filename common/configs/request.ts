import {
    BACKEND_HOSTNAME,
} from 'common/libs/env';

const protocol = document?.location.protocol;

export const backend = {
    hostname: `${protocol}//${BACKEND_HOSTNAME}`,
};

const testsPrefix = '/tests';
const tasksPrefix = '/task';
const resultsPrefix = '/result';
const answersPrefix = '/answer';
export const handlers = {
    tests: {
        prefix: testsPrefix,
        create: testsPrefix,
        getOne: testsPrefix,
        update: testsPrefix,
        addTask: `${testsPrefix}${tasksPrefix}`,
        getTask: `${testsPrefix}${tasksPrefix}`,
        updateTask: `${testsPrefix}${tasksPrefix}`,
        deleteTask: `${testsPrefix}${tasksPrefix}`,
        createResult: `${testsPrefix}${resultsPrefix}`,
        updateResult: `${testsPrefix}${resultsPrefix}`,
        answer: `${testsPrefix}${answersPrefix}`,
    },
};

export const fetch = {
    options: {
        retries: 2,
        retryDelay: 500,
    },
};
