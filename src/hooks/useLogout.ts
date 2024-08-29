'use client'

import { useCreateLogout } from '@/api/logins'
import { useCartStore } from '@/app/(protected)/employee/companies/[companyCode]/state'
import { queryClient } from '@/lib/react-query'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { useCompanyStore } from '@/state'
import { useBaseUrl, useSafeReplace } from '.'
import { useIdentity } from './useIdentity'

export const useLogout = () => {
    const { resetCart } = useCartStore()
    const { safeReplace } = useSafeReplace()
    const { setIdentity } = useIdentity()
    const { clearRoles } = useRoles()
    const { baseUrl } = useBaseUrl()
    const setCompany = useCompanyStore(state => state.setCompany)

    const { mutate } = useCreateLogout()

    const goToLogin = () => {
        return safeReplace(`${baseUrl}/login`)
    }

    // TODO: clear cart state

    return () => {
        mutate(undefined, {
            onSettled: () => {
                Promise.all([
                    setIdentity(null),
                    queryClient.removeQueries(),
                    clearRoles(),
                    setCompany(null, null),
                    resetCart()
                ]).then(goToLogin)
            },
            onError: () => {
                Promise.all([
                    setIdentity(null),
                    queryClient.removeQueries(),
                    clearRoles(),
                    setCompany(null, null),
                    resetCart()
                ]).then(goToLogin)
            }
        })
    }
}
