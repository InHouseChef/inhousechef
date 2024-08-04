export type DateTimeIsoUtc = string & { readonly __brand?: unique symbol }

export type DateIso = string & { readonly __brand?: unique symbol }

export interface BaseEntity {
    id: string
    createdAt: DateTimeIsoUtc
    updatedAt: DateTimeIsoUtc
}

export type PathParams = { [key: string]: any }

export type DefaultPathParams<T> = T & PathParams

export interface LocationPath {
    href: string
    pathname: string
}

export interface MutationParams<TPath extends PathParams = PathParams, TRequest extends unknown = void> {
    path: Required<TPath>
    body?: TRequest
}

export type FilterProps<TFilter> = {
    value: TFilter
    onApply: (value: TFilter) => void
}

export interface AppJwt extends Omit<Jwt, 'type'> {
    type: 'access' | 'identity' | 'refresh'
    user: string
    usertype: 'companyuser' | 'enduser'
    company: string
    access: 'unrestricted' | 'authorized' | 'facility'
    role: string
    facility?: string
}

export type Modify<T, R> = Omit<T, keyof R> & R
