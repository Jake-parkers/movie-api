export interface Auth {
  getToken(username: string, password: string): string;
}

export interface UserAccessTokenPayload {
  userId: number
  name: string
  role: string
  iat: number
  exp: number
  iss: string
  sub: string
}