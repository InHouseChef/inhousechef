import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadShiftResponse } from '../../contract'
import { SHIFT_KEYS } from '../keys'

interface ReadShiftPath {
    companyCode: string
    shiftId: string
}
interface ReadShiftParams extends QueryParams<ReadShiftPath> {}

export const readShift = ({ path: { companyCode, shiftId } }: ReadShiftParams): Promise<ReadShiftResponse> =>
    axiosPrivate.get(`/companies/${companyCode}/shifts/${shiftId}`)

interface UseReadShiftParams<T> extends DefaultQueryParams<ReadShiftPath>, QueryOptions {
    select?: (response: ReadShiftResponse) => T
}

export const useReadShift = <T = ReadShiftResponse>(params?: UseReadShiftParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        gcTime: 0,
        queryKey: SHIFT_KEYS.resource(defaultParams.path.shiftId),
        queryFn: () => readShift(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.shiftId) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
