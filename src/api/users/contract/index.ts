import { Role } from '@/types'

interface UserResponse {
    id: string
    companyId: string
    username: string
    role: Role
    name: string
}

export interface ReadMyUserResponse extends UserResponse {}

export interface ReadUserResponse extends UserResponse {}

export interface CreateUserRequest {
    userName: string
    password: string
    fullName: string
}

export interface CreateUserResponse {
    userId: string
    userName: string
}
