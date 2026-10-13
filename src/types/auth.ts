export type Role = 'USER' | 'ADMIN'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

/** O refresh token fica num cookie httpOnly definido pela API; o front só vê o access token. */
export type TokenPair = {
  accessToken: string
}

export type AuthResponse = TokenPair & {
  user: AuthUser
}

export type ApiError = {
  message: string | string[]
  statusCode: number
}
