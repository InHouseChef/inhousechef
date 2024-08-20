import { Roles } from '@/types'

interface UserResponse {
    id: string
    companyId: string
    username: string
    role: Roles
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
    userId: string
    userName: string
    role: Roles
    fullName: string
}


export enum RolesEnum {
    Admin = 'Admin',
    CompanyManager = 'CompanyManager',
    Employee = 'Employee'
}