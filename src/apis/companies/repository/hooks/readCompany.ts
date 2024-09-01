import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadCompanyResponse } from '../../contract'
import { COMPANY_KEYS } from '../keys'

interface ReadCompanyPath {
    companyCode: string
}
interface ReadCompanyParams extends QueryParams<ReadCompanyPath> {}

export const readCompany = ({ path: { companyCode } }: ReadCompanyParams): Promise<ReadCompanyResponse> =>
    axiosPrivate.get(`/companies/${companyCode}`)

interface UseReadCompanyParams<T> extends DefaultQueryParams<ReadCompanyPath>, QueryOptions {
    select?: (response: ReadCompanyResponse) => T
}

export const useReadCompany = <T = ReadCompanyResponse>(params?: UseReadCompanyParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        gcTime: 0,
        queryKey: COMPANY_KEYS.resource(defaultParams.path.companyCode),
        queryFn: () => readCompany(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.companyCode) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
