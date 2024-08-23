import { FC, PropsWithChildren, ReactNode } from 'react'

interface RPProps<T> {
    fallback?: ReactNode
    role: T | T[]
    loader?: ReactNode
    children?: ReactNode
    some?: boolean
}

export type RequireCompanyRoleComponent<T> = FC<PropsWithChildren<RPProps<T>>>
