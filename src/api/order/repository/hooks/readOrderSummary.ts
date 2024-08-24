import {
    DefaultQueryParams,
    getDefaultBooleanValue,
    QueryOptions,
    QueryParams,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { CompanyPath } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadOrderSummaryResponse } from '../../contract'
import { ORDER_SUMMARY_KEYS } from '../keys'

interface ReadOrderSummaryPath extends CompanyPath {}
interface ReadOrderSummaryParams extends QueryParams<ReadOrderSummaryPath> {}

const readOrderSummary = ({ path: { companyCode } }: ReadOrderSummaryParams): Promise<ReadOrderSummaryResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/orders/ummary`)

interface UseReadOrderSummaryParams<T> extends DefaultQueryParams<ReadOrderSummaryPath>, QueryOptions {
    select?: (response: ReadOrderSummaryResponse) => T
}

export const useReadOrderSummary = <T = ReadOrderSummaryResponse>(params?: UseReadOrderSummaryParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        queryKey: ORDER_SUMMARY_KEYS.resource(defaultParams.path.companyCode),
        queryFn: () => readOrderSummary(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.companyCode) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
