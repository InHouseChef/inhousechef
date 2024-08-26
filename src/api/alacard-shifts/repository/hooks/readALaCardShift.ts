import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadALaCardShiftResponse } from '../../contract'
import { ALACARD_SHIFT_KEYS } from '../keys'

interface ReadALaCardShiftPath {
    companyCode: string
}
interface ReadALaCardShiftParams extends QueryParams<ReadALaCardShiftPath> {}

export const readALaCardShift = ({ path: { companyCode } }: ReadALaCardShiftParams): Promise<ReadALaCardShiftResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/a-la-card-shifts`)

interface UseReadALaCardShiftParams<T> extends DefaultQueryParams<ReadALaCardShiftPath>, QueryOptions {
    select?: (response: ReadALaCardShiftResponse) => T
}

export const useReadALaCardShift = <T = ReadALaCardShiftResponse>(params?: UseReadALaCardShiftParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({ 
        gcTime: 0,
        queryKey: ALACARD_SHIFT_KEYS.resource(),
        queryFn: () => readALaCardShift(defaultParams),
        select: params?.select,
        enabled: getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
