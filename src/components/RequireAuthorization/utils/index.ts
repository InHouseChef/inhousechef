import { CompanyUserRole, CompanyUserRoles } from '@/types'

type Roles = Partial<CompanyUserRoles>
type Role = Partial<CompanyUserRole>

export const isAllowed = (roles: Roles, role: Role | Role[], some?: boolean): boolean => {
    if (Array.isArray(role)) return some ? role.some(item => roles[item]) : role.every(item => roles[item])
    else return Boolean(roles[role])
}
