let env: any = {
    NODE_ENV: 'development',
    ...process.env,
};

// passed env from frontback to client
if (typeof window !== 'undefined') {
    env = (window as any).env;
}

env = {
    ...env,
    IS_DEVELOPMENT: env.NODE_ENV === 'development',
};

export const {
    APP_ENV,
    BACKEND_HOSTNAME,
    IS_DEVELOPMENT,
    NODE_ENV,
    NODE_PATH,
    PROJECT_ROOT,
    DATABASE_USER,
    DATABASE_PASSWORD,
} = env;

export default env;
