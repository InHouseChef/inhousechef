import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadUserCompanyResponse } from '../../contract'
import { COMPANY_USER_KEYS } from '../keys'

interface ReadUserCompanyPath {}
interface ReadUserCompanyParams extends QueryParams<ReadUserCompanyPath> {}

export const readUserCompany = (): Promise<ReadUserCompanyResponse> => axiosPrivate.get('/companies/me')

interface UseReadUserCompanyParams<T> extends DefaultQueryParams<ReadUserCompanyPath>, QueryOptions {
    select?: (response: ReadUserCompanyResponse) => T
}

// export const useReadUserCompany = <T = ReadUserCompanyResponse>(params?: UseReadUserCompanyParams<T>) => {
//     const defaultParams = useDefaultQueryParams(params)
//     return useQuery({
//         queryKey: COMPANY_USER_KEYS.base,
//         queryFn: () => readUserCompany(defaultParams),
//         select: params?.select,
//         enabled: getDefaultBooleanValue(params?.options?.enabled),
//         placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
//     })
// }
