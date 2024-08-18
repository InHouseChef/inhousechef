import {
    DefaultQueryParams,
    getDefaultBooleanValue,
    QueryOptions,
    QueryParams,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { ReadDailyMenuResponse } from '../../contract'
import { DAILY_MENU_KEYS } from '../keys'

interface ReadDailyMenusPath {}
interface ReadDailyMenusParams extends QueryParams<ReadDailyMenusPath> {}

const readDailyMenus = ({}: ReadDailyMenusParams): Promise<ReadDailyMenuResponse[]> => axiosPrivate.get('/daily-menus')

interface UseReadDailyMenusParams extends DefaultQueryParams<ReadDailyMenusPath>, QueryOptions {}

export const useReadDailyMenus = (params?: UseReadDailyMenusParams) => {
    const defaultParams = useDefaultQueryParams(params)

    return useQuery({
        queryKey: DAILY_MENU_KEYS.collection(defaultParams),
        queryFn: () => readDailyMenus(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
