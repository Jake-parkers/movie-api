// intellisense for process.env
declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    MOVIE_API_URL: string;
  }
}
