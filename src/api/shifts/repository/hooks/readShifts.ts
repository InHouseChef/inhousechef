import {
    DefaultQueryParams,
    getDefaultBooleanValue,
    QueryOptions,
    QueryParams,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { CompanyPath } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { ReadShiftResponse } from '../../contract'
import { SHIFT_KEYS } from '../keys'

interface ReadShiftsPath extends CompanyPath {}
interface ReadShiftsParams extends QueryParams<ReadShiftsPath> {}

const readShifts = ({ path: { companyCode } }: ReadShiftsParams): Promise<ReadShiftResponse[]> =>
    axiosPrivate.get(`/companies/${companyCode}/shifts`)

interface UseReadShiftsParams extends DefaultQueryParams<ReadShiftsPath>, QueryOptions {}

export const useReadShifts = (params?: UseReadShiftsParams) => {
    const defaultParams = useDefaultQueryParams(params)

    return useQuery({
        queryKey: SHIFT_KEYS.collection(defaultParams),
        queryFn: () => readShifts(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
