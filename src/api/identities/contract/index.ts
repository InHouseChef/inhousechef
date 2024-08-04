type TokenType = 'identity' | 'access'
type GrantType = 'password_credentials' | 'client_credentials' | 'access_token' | 'refresh_token' | 'identity_token'
type Destination = 'Admin' | 'QuikStor' | 'Company'

export interface Identity {
    token: string
    tokenType: TokenType
    expiresIn: number
    refreshToken: string
}

interface LoginRequest<T extends GrantType> {
    grantType: T
    destination?: Destination
    destinationId?: string
}

export interface LoginPasswordCredentialsRequest extends LoginRequest<'password_credentials'> {
    email?: string
    password: string
}

export interface LoginClientCredentialsRequest extends LoginRequest<'client_credentials'> {
    clientId: string
    clientSecret: string
}

export interface LoginAccessTokenRequest extends LoginRequest<'access_token'> {
    accessToken: string
}

export interface LoginRefreshTokenRequest extends LoginRequest<'refresh_token'> {
    refreshToken: string
}

export interface LoginIdentityTokenRequest extends LoginRequest<'identity_token'> {
    identityToken: string
}

export type CreateLoginRequest =
    | LoginPasswordCredentialsRequest
    | LoginClientCredentialsRequest
    | LoginAccessTokenRequest
    | LoginRefreshTokenRequest
    | LoginIdentityTokenRequest

export interface CreateLoginResponse extends Identity {}

export interface CreateResetPasswordRequest {
    email: string
}

export interface CreateForgotPasswordRequest {
    email: string
}

export interface UpdatePasswordRequest {
    email: string
    verificationCode: string
    password: string
}

export interface CreateRegistrationRequest {
    email: string
    password: string
}

export interface CreateRegistrationResponse extends Identity {}

export interface ReadVerificationCodeFilter {
    email?: string
    code?: string
}

export interface ReadVerificationCodeResponse {}

export interface CreateUserRequest {
    email?: string
    password?: string
}

export type CreateUserResponse = string[]
