import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadALaCardMenuResponse } from '../../contract'
import { ALACARD_MENU_KEYS } from '../keys'

interface ReadALaCardMenuPath {
    aLaCardMenuId: string
}
interface ReadALaCardMenuParams extends QueryParams<ReadALaCardMenuPath> {}

const readALaCardMenu = ({ path: { aLaCardMenuId } }: ReadALaCardMenuParams): Promise<ReadALaCardMenuResponse> =>
    axiosPrivate.get(`/alacard-menus/${aLaCardMenuId}`)

interface UseReadALaCardMenuParams<T> extends DefaultQueryParams<ReadALaCardMenuPath>, QueryOptions {
    select?: (response: ReadALaCardMenuResponse) => T
}

export const useReadALaCardMenu = <T = ReadALaCardMenuResponse>(params?: UseReadALaCardMenuParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        queryKey: ALACARD_MENU_KEYS.resource(defaultParams.path.aLaCardMenuId),
        queryFn: () => readALaCardMenu(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.aLaCardMenuId) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
