import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
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

interface ReadUsersPath extends CompanyPath {}
interface ReadUsersParams extends QueryParams<ReadUsersPath> {}

const readUsers = ({ path: { companyCode }, query }: ReadUsersParams): OffsetResultsPromise<ReadUserResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/users?${createBaseUrlQuery(query)}`)

interface UseReadUsersParams extends DefaultQueryParams<ReadUsersPath>, QueryOptions {}

export const useReadUsers = (params?: UseReadUsersParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
    })

    return useQuery({
        queryKey: USER_KEYS.collection(defaultParams),
        queryFn: () => readUsers(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
