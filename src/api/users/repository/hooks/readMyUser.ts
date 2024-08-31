import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { MY_USER_KEYS } from '@/keys'
import { axiosPrivate } from '@/lib/axios'
import { CompanyPath } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadUserResponse } from '../../contract'

interface ReadMyUserPath extends CompanyPath {}
interface ReadMyUserParams extends QueryParams<ReadMyUserPath> {}

const readMyUser = ({ path: { companyCode } }: ReadMyUserParams): Promise<ReadUserResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/users/me`)

interface UseReadMyUserParams<T> extends DefaultQueryParams<ReadMyUserPath>, QueryOptions {
    select?: (response: ReadUserResponse) => T
}

export const useReadMyUser = <T = ReadUserResponse>(params?: UseReadMyUserParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        queryKey: MY_USER_KEYS.base,
        queryFn: () => readMyUser(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.companyCode) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
