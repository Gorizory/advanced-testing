let env: any = {
    NODE_ENV: 'development',
    ...process.env,
};

// passed env from frontback to client
if (typeof window !== 'undefined') {
    env = {
        ...env,
        ...(window as any).env,
    };
}

env = {
    ...env,
    IS_DEVELOPMENT: env.NODE_ENV === 'development',
};

export const {
    APP_ENV,
    IS_DEVELOPMENT,
    NODE_ENV,
    NODE_PATH,
    PROJECT_ROOT,
} = env;

export default env;
