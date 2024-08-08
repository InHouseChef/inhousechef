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
import { useQuery } from '@tanstack/react-query'
import { ReadCompanyResponse } from '../../contract'
import { COMPANY_KEYS } from '../keys'

interface ReadCompaniesPath {}
interface ReadCompaniesParams extends QueryParams<ReadCompaniesPath> {}

const readCompanies = ({}: ReadCompaniesParams): OffsetResultsPromise<ReadCompanyResponse> => axiosPrivate.get('/companies')

interface UseReadCompaniesParams extends DefaultQueryParams<ReadCompaniesPath>, QueryOptions {}

export const useReadCompanies = (params?: UseReadCompaniesParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
    })

    return useQuery({
        queryKey: COMPANY_KEYS.collection(defaultParams),
        queryFn: () => readCompanies(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
