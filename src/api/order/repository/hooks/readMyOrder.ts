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
import { ReadMyOrderResponse } from '../../contract'
import { MY_ORDER_KEYS } from '../keys'

interface ReadMyOrderPath extends CompanyPath {}
interface ReadMyOrderParams extends QueryParams<ReadMyOrderPath> {}

const readMyOrder = ({ path: { companyCode } }: ReadMyOrderParams): Promise<ReadMyOrderResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/orders/me`)

interface UseReadMyOrderParams<T> extends DefaultQueryParams<ReadMyOrderPath>, QueryOptions {
    select?: (response: ReadMyOrderResponse) => T
}

export const useReadMyOrder = <T = ReadMyOrderResponse>(params?: UseReadMyOrderParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        queryKey: MY_ORDER_KEYS.base,
        queryFn: () => readMyOrder(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.companyCode) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
