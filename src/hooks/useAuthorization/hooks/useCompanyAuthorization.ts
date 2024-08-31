'use client'

import { useIdentity } from '@/hooks/useIdentity'
import { CompanyUserRoles } from '@/types'
import { isDeepEqualObject } from '@/utils'
import { useEffect, useState } from 'react'
import { UseAuthorization, UseAuthorizationResult } from '../types'

type UseCompanyAuthorization = UseAuthorization<CompanyUserRoles>

export const useCompanyAuthorization = (): UseCompanyAuthorization => {
    const { jwt } = useIdentity()
    const [result, setResult] = useState<UseAuthorizationResult>({ AuthorizationReady: false })
    const [roles, setRoles] = useState<CompanyUserRoles>({
        Admin: false,
        CompanyManager: false,
        Employee: false,
        RestaurantWorker: false
    })

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

        setResult(prev => (prev.AuthorizationReady ? prev : { AuthorizationReady: true }))
    }, [jwt, roles])

    return { result, roles }
}
