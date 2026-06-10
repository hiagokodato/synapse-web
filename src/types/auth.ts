export type Role = 'USER' | 'ADMIN'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

export type TokenPair = {
  accessToken: string
  refreshToken: string
}

export type AuthResponse = TokenPair & {
  user: AuthUser
}

export type ApiError = {
  message: string | string[]
  statusCode: number
}
