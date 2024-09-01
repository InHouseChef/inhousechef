import { ReadMyUserResponse } from '@/apis/users'
import { useIdentity } from '@/hooks'
import { QueryOptions, getDefaultBooleanValue } from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { COMPANY_USER_KEYS } from '../keys'

export const readUserCompany = (): Promise<ReadMyUserResponse> => axiosPrivate.get('/companies/me')
interface UseReadUserCompanyParams extends QueryOptions {}

export const useReadUserCompany = (params?: UseReadUserCompanyParams) => {
    const { identity, jwt } = useIdentity()

    return useQuery({
        gcTime: 0,
        queryKey: COMPANY_USER_KEYS.base,
        queryFn: () => readUserCompany(),
        enabled:
            Boolean(identity?.accessToken) &&
            Boolean(!jwt?.['cognito:groups'].includes('Admin')) &&
            getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
