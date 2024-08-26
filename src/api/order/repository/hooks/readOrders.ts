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
import { ReadOrderResponse } from '../../contract'
import { ORDER_KEYS } from '../keys'

interface ReadOrdersPath extends CompanyPath {}
interface ReadOrdersParams extends QueryParams<ReadOrdersPath> {}

const readOrders = ({ path: { companyCode }, query }: ReadOrdersParams): OffsetResultsPromise<ReadOrderResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/orders?${createBaseUrlQuery(query)}`)

interface UseReadOrdersParams extends DefaultQueryParams<ReadOrdersPath>, QueryOptions {}

export const useReadOrders = (params?: UseReadOrdersParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
    })

    return useQuery({ gcTime: 0,
        queryKey: ORDER_KEYS.collection(defaultParams),
        queryFn: () => readOrders(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
