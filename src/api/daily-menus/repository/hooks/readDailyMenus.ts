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
import { ReadDailyMenuResponse } from '../../contract'
import { DAILY_MENU_KEYS } from '../keys'

interface ReadDailyMenusPath {}
interface ReadDailyMenusParams extends QueryParams<ReadDailyMenusPath> {}

const readDailyMenus = ({}: ReadDailyMenusParams): OffsetResultsPromise<ReadDailyMenuResponse> =>
    axiosPrivate.get('/daily-menus')

interface UseReadDailyMenusParams extends DefaultQueryParams<ReadDailyMenusPath>, QueryOptions {}

export const useReadDailyMenus = (params?: UseReadDailyMenusParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
    })

    return useQuery({
        queryKey: DAILY_MENU_KEYS.collection(defaultParams),
        queryFn: () => readDailyMenus(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
