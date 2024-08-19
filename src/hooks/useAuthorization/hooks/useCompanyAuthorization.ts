import { Roles } from '@/types'
import { isDeepEqualObject } from '@/utils'
import { useEffect, useState } from 'react'
import { UseAuthorization, UseAuthorizationResult } from '../types'

type UseCompanyAuthorization = UseAuthorization<Roles>

export const useCompanyAuthorization = (): UseCompanyAuthorization => {
    // const { isFetched, data } = useMyCompanyPermissions()
    const [result, setResult] = useState<UseAuthorizationResult>({ AuthorizationReady: false })
    const [roles, setRoles] = useState()

    useEffect(() => {
        if (!isFetched || !data) return
        if (isDeepEqualObject(data, roles)) return setResult({ AuthorizationReady: true })
        setResult({ AuthorizationReady: isFetched })
        setRoles(data)
    }, [isFetched, data])

    return {
        result,
        roles
    }
}
