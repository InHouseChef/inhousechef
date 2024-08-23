import { useCompanyAuthorization } from '@/hooks'
import { CompanyUserRole, CompanyUserRoles } from '@/types'
import { FC, PropsWithChildren, ReactNode } from 'react'

interface RPProps<T> {
    fallback?: ReactNode
    role: T | T[]
    loader?: ReactNode
    children?: ReactNode
    some?: boolean
}

type RequireCompanyRoleComponent<T> = FC<PropsWithChildren<RPProps<T>>>

type Roles = Partial<CompanyUserRoles>
type Role = Partial<CompanyUserRole>

const isAllowed = (roles: Roles, role: Role | Role[], some?: boolean): boolean => {
    if (Array.isArray(role)) return some ? role.some(item => roles[item]) : role.every(item => roles[item])
    else return Boolean(roles[role])
}

export const RequireCompanyAuthorization: RequireCompanyRoleComponent<CompanyUserRole> = ({
    role,
    fallback,
    children,
    loader,
    some
}) => {
    const {
        result: { AuthorizationReady },
        roles
    } = useCompanyAuthorization()

    const allowed = isAllowed(roles, role, some)

    return <>{AuthorizationReady ? (role && allowed ? children : fallback) : loader || undefined}</>
}
