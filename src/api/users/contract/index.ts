import { Roles } from '@/types'

interface UserResponse {
    id: string
    companyId: string
    username: string
    role: RolesEnum.CompanyManager | RolesEnum.Employee | RolesEnum.RestaurantWorker
    fullName: string,
    aLaCardPermission: boolean
}

export interface ReadMyUserResponse extends UserResponse {}

export interface ReadUserResponse extends UserResponse {}

export interface CreateUserRequest {
    username: string
    password: string
    fullName: string
    role: Roles
    aLaCardPermission: boolean
}

export interface CreateUserResponse {
    id: string
    companyId: string
    username: string
    role: Roles
    fullName: string
    aLaCardPermission: boolean
}

export interface UpdateUserProfileRequest {
    role: Roles
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
    RestaurantWorker = 'RestaurantWorker',
}