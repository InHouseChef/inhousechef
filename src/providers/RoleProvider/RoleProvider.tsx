'use client'

import { useIdentity } from '@/hooks/useIdentity'
import { CompanyUserRoles } from '@/types'
import { isDeepEqualObject } from '@/utils'
import { createContext, useContext, useEffect, useState } from 'react'

interface RoleContextValue {
    roles: CompanyUserRoles
    AuthorizationReady: boolean
}

const defaultRoles: CompanyUserRoles = {
    Admin: false,
    CompanyManager: false,
    Employee: false,
    RestaurantWorker: false
}

const RoleContext = createContext<RoleContextValue>({
    roles: defaultRoles,
    AuthorizationReady: false
})

export const useRoles = () => useContext(RoleContext)

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
    const { jwt } = useIdentity()
    const [roles, setRoles] = useState<CompanyUserRoles>(defaultRoles)
    const [AuthorizationReady, setAuthorizationReady] = useState(false)

    useEffect(() => {
        if (!jwt?.['cognito:groups']) return

        const cognitoGroups = jwt['cognito:groups'] as string[]
        const updatedRoles: CompanyUserRoles = {
            Admin: cognitoGroups.includes('Admin'),
            CompanyManager: cognitoGroups.includes('CompanyManager'),
            Employee: cognitoGroups.includes('Employee'),
            RestaurantWorker: cognitoGroups.includes('RestaurantWorker')
        }

        if (!isDeepEqualObject(updatedRoles, roles)) {
            setRoles(updatedRoles)
        }

        if (!AuthorizationReady) {
            setAuthorizationReady(true)
        }
    }, [jwt, roles, AuthorizationReady])

    return <RoleContext.Provider value={{ roles, AuthorizationReady }}>{children}</RoleContext.Provider>
}
