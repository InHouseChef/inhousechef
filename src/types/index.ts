export type DateTimeIsoUtc = string & { readonly __brand?: unique symbol }

export type DateIso = string & { readonly __brand?: unique symbol }

export type Time = string & { readonly __brand?: unique symbol }

export type DateLocalIso = string & { readonly __brand?: unique symbol }

export interface BaseEntity {
    id: string
    createdAt: DateTimeIsoUtc
    updatedAt: DateTimeIsoUtc
}

export type PathParams = { [key: string]: any }

export type DefaultPathParams<T> = T & PathParams

export type CompanyPath = {
    companyCode: string
}

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
    access: 'unrestricted' | 'authorized'
    'cognito:groups': [CompanyUserRole]
    grant_type: 'password_credentials' | 'refresh_token'
    username?: string
    password?: string
    refreshToken?: string
}

export type Modify<T, R> = Omit<T, keyof R> & R

export type FileTypes = 'jpg' | 'jpeg' | 'png'

export type CompanyUserRole = 'Admin' | 'CompanyManager' | 'Employee' | 'RestaurantWorker'

export type CompanyUserRoles = Record<CompanyUserRole, boolean>

export type OrderState = 'Draft' | 'Placed' | 'Confirmed' | 'Cancelled'

export type OrderType = 'Scheduled' | 'Immediate'

export interface Branding {
    primaryColor?: string
    secondaryColor?: string
    logoUrl?: string
    faviconUrl?: string
}
