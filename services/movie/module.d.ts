// intellisense for process.env
declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    OMDB_BASE_URL: string;
    OMDB_API_KEY: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;
    REDIS_PORT: string
    REDIS_PASSWORD: string
  }
}
