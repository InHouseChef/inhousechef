export type UseAuthorizationResult = {
    AuthorizationReady: boolean
}

export type UseAuthorization<T> = {
    roles: T
    result: UseAuthorizationResult
}
