import {
    DefaultQueryParams,
    getDefaultBooleanValue,
    QueryOptions,
    QueryParams,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { OffsetResultsPromise } from '@/packages/types'
import { CompanyPath } from '@/types'
import { createBaseUrlQuery } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { ReadUserResponse } from '../../contract'
import { USER_KEYS } from '../keys'

interface ReadUsersByIdsPath extends CompanyPath {}
interface ReadUsersByIdsParams extends QueryParams<ReadUsersByIdsPath> {}

export type ReadUsersByIdsResponse = Promise<{
    companyUsers: ReadUserResponse[]
}>

export const readUsersByIds = ({ path: { companyCode }, query }: ReadUsersByIdsParams): ReadUsersByIdsResponse =>
    axiosPrivate.get(`/companies/${companyCode}/users/by-ids?${createBaseUrlQuery(query)}`)

interface UseReadUsersParams extends DefaultQueryParams<ReadUsersByIdsPath>, QueryOptions {}

export const useReadUsersByIds = (params?: UseReadUsersParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params
    })

    return useQuery({
        gcTime: 0,
        queryKey: USER_KEYS.collection(defaultParams),
        queryFn: () => readUsersByIds(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
