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
import { CompanyPath, OrderState } from '@/types'
import { createBaseUrlQuery } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { ORDER_KEYS } from '../keys'
import { ScheduledOrderDetails } from '@/app/(protected)/newstate'

interface ReadScheduledOrdersPath extends CompanyPath {}
interface ReadScheduledOrdersParams extends QueryParams<ReadScheduledOrdersPath> {
    forDate?: string
    shiftId?: string
    state?: OrderState
    searchByNumber?: string
}

export const readScheduledOrders = ({ path: { companyCode }, query }: ReadScheduledOrdersParams): OffsetResultsPromise<ScheduledOrderDetails> =>
    axiosPrivate.get(`/companies/${companyCode}/orders/scheduled?${createBaseUrlQuery(query)}`)

interface UseReadOrdersParams extends DefaultQueryParams<ReadScheduledOrdersPath>, QueryOptions {}

export const useReadScheduledOrders = (params?: UseReadOrdersParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
    })

    return useQuery({
        gcTime: 0,
        queryKey: ORDER_KEYS.collection(defaultParams),
        queryFn: () => readScheduledOrders(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
