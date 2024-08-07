type TokenType = 'identity' | 'access'
type GrantType = 'password_credentials' | 'refresh_token'

export interface Identity {
    token: string
    tokenType: TokenType
    expiresIn: number
    refreshToken: string
}

interface LoginRequest<T extends GrantType> {
    grantType: T
}

export interface LoginPasswordCredentialsRequest extends LoginRequest<'password_credentials'> {
    username?: string
    password: string
}

export interface LoginRefreshTokenRequest extends LoginRequest<'refresh_token'> {
    refreshToken: string
}

export type CreateLoginRequest = LoginPasswordCredentialsRequest | LoginRefreshTokenRequest

export interface CreateLoginResponse extends Identity {}
