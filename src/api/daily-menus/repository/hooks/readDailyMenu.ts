import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadDailyMenuResponse } from '../../contract'
import { DAILY_MENU_KEYS } from '../keys'

interface ReadDailyMenuPath {
    dailyMenuId: string
}
interface ReadDailyMenuParams extends QueryParams<ReadDailyMenuPath> {}

const readDailyMenu = ({ path: { dailyMenuId } }: ReadDailyMenuParams): Promise<ReadDailyMenuResponse> =>
    axiosPrivate.get(`/daily-menus/${dailyMenuId}`)

interface UseReadDailyMenuParams<T> extends DefaultQueryParams<ReadDailyMenuPath>, QueryOptions {
    select?: (response: ReadDailyMenuResponse) => T
}

export const useReadDailyMenu = <T = ReadDailyMenuResponse>(params?: UseReadDailyMenuParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({ gcTime: 0,
        queryKey: DAILY_MENU_KEYS.resource(defaultParams.path.dailyMenuId),
        queryFn: () => readDailyMenu(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.dailyMenuId) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
