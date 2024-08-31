import { Branding, CompanyUserRole } from '@/types'

interface UserResponse {
    id: string
    companyId: string
    username: string
    role: RolesEnum.Admin | RolesEnum.CompanyManager | RolesEnum.Employee | RolesEnum.RestaurantWorker
    fullName: string
    aLaCardPermission: boolean
}

export interface ReadMyUserResponse {
    companyId: string
    companyCode: string
    branding?: Branding
}

export interface ReadUserResponse extends UserResponse {}

export interface CreateUserRequest {
    username: string
    password: string
    fullName: string
    role: CompanyUserRole
    aLaCardPermission: boolean
}

export interface CreateUserResponse {
    id: string
    companyId: string
    username: string
    role: CompanyUserRole
    fullName: string
    aLaCardPermission: boolean
}

export interface UpdateUserProfileRequest {
    role: CompanyUserRole
    fullName: string
}

export interface UpdateUserProfileResponse extends UserResponse {}

export interface UpdateUserALaCardPermissionRequest {
    aLaCard: boolean
}

export interface UpdateUserALaCardPermissionResponse extends UserResponse {}

export enum RolesEnum {
    Admin = 'Admin',
    CompanyManager = 'CompanyManager',
    Employee = 'Employee',
    RestaurantWorker = 'RestaurantWorker'
}

export interface UpdateMyPasswordRequest {
    newPassword: string
}
