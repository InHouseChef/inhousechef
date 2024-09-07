'use client'

import { useCreateLogout } from '@/api/logins'
import { queryClient } from '@/lib/react-query'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { useCompanyStore } from '@/state'
import { useBaseUrl, useSafeReplace } from '.'
import { useIdentity } from './useIdentity'
import { settingsStore } from './useSettings'
import { useCartStore } from '@/app/(protected)/newstate'

export const useLogout = () => {
    const { safeReplace } = useSafeReplace()
    const { setIdentity } = useIdentity()
    const { clearRoles } = useRoles()
    const { baseUrl } = useBaseUrl()
    const setCompany = useCompanyStore(state => state.setCompany)
    const { setBranding } = settingsStore()
    const { resetCart } = useCartStore()

    const { mutate } = useCreateLogout()

    const goToLogin = () => {
        return safeReplace(`${baseUrl}/login`)
    }

    return () => {
        mutate(undefined, {
            onSettled: () => {
                Promise.all([setIdentity(null), queryClient.removeQueries(), clearRoles(), setCompany(null, null), setBranding(null), resetCart()]).then(
                    goToLogin
                )
            },
            onError: () => {
                Promise.all([setIdentity(null), queryClient.removeQueries(), clearRoles(), setCompany(null, null), setBranding(null), resetCart()]).then(
                    goToLogin
                )
            }
        })
    }
}
