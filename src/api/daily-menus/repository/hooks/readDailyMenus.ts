import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import {
    DefaultQueryParams,
    getDefaultBooleanValue,
    QueryOptions,
    QueryParams,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { createBaseUrlQuery } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { ReadDailyMenuResponse } from '../../contract'
import { DAILY_MENU_KEYS } from '../keys'

interface ReadDailyMenusPath {}
interface ReadDailyMenusParams extends QueryParams<ReadDailyMenusPath> {}

export const readDailyMenus = ({ query }: ReadDailyMenusParams): Promise<ReadDailyMenuResponse[]> =>
    axiosPrivate.get(`/daily-menus?${createBaseUrlQuery(query)}`)

interface UseReadDailyMenusParams<T> extends DefaultQueryParams<ReadDailyMenusPath>, QueryOptions {
    select?: (response: ReadDailyMenuResponse[]) => T
}

export const useReadDailyMenus = <T = ReadDailyMenuResponse[]>(params?: UseReadDailyMenusParams<T>) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST }, filter: { ...params?.query?.filter } }
    })

    return useQuery({
        queryKey: DAILY_MENU_KEYS.collection(defaultParams),
        queryFn: () => readDailyMenus(defaultParams),
        select: params?.select,
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
