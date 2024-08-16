import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { CompanyPath } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadUserResponse } from '../../contract'
import { USER_KEYS } from '../keys'

interface ReadUserPath extends CompanyPath {
    userId: string
}
interface ReadUserParams extends QueryParams<ReadUserPath> {}

const readUser = ({ path: { companyCode, userId } }: ReadUserParams): Promise<ReadUserResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/users/${userId}`)

interface UseReadUserParams<T> extends DefaultQueryParams<ReadUserPath>, QueryOptions {
    select?: (response: ReadUserResponse) => T
}

export const useReadUser = <T = ReadUserResponse>(params?: UseReadUserParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        queryKey: USER_KEYS.resource(defaultParams.path.userId),
        queryFn: () => readUser(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.userId) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
