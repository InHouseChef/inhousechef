// src/components/RequireAuthorization/RequireAuthorization.tsx
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { CompanyUserRoles } from '@/types'
import { FC, PropsWithChildren, ReactNode } from 'react'

interface RPProps<T> {
    role: keyof T
    fallback?: ReactNode
    loader?: ReactNode
    some?: boolean
}

type RequireCompanyRoleComponent<T> = FC<PropsWithChildren<RPProps<T>>>

const isAllowed = (roles: CompanyUserRoles, role: keyof CompanyUserRoles): boolean => {
    return roles[role]
}

export const RequireCompanyAuthorization: RequireCompanyRoleComponent<CompanyUserRoles> = ({
    role,
    fallback,
    children,
    loader
}) => {
    const { roles, AuthorizationReady } = useRoles()
    
    const allowed = isAllowed(roles, role)

    return <>{AuthorizationReady ? (allowed ? children : fallback) : loader || null}</>
}
