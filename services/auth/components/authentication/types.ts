export interface Auth {
  getToken(username: string, password: string): string;
}
