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
import { ReadALaCardMenuResponse } from '../../contract'
import { ALACARD_MENU_KEYS } from '../keys'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'

interface ReadALaCardMenusPath {}
interface ReadALaCardMenusParams extends QueryParams<ReadALaCardMenusPath> {}

export const readALaCardMenus = ({ query }: ReadALaCardMenusParams): Promise<ReadALaCardMenuResponse[]> =>
    axiosPrivate.get(`/alacard-menus?${createBaseUrlQuery(query)}`)

interface UseReadALaCardMenusParams<T> extends DefaultQueryParams<ReadALaCardMenusPath>, QueryOptions {
    select?: (response: ReadALaCardMenuResponse[]) => T
}

export const useReadALaCardMenus = <T = ReadALaCardMenuResponse[]>(params?: UseReadALaCardMenusParams<T>) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST }}
    })

    return useQuery({ gcTime: 0,
        queryKey: ALACARD_MENU_KEYS.collection(defaultParams),
        queryFn: () => readALaCardMenus(defaultParams),
        select: params?.select,
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
