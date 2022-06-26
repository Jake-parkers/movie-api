// intellisense for process.env
declare namespace NodeJS {
  export interface ProcessEnv {
    DB_HOST: string;
    DB_NAME: string;
    JWT_SECRET: string;
    SALT_ROUNDS: string;
    PROXY_BASE_URL: string;
    NODE_ENV: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: string;
  }
}
