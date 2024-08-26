import {
    DefaultQueryParams,
    QueryOptions,
    QueryParams,
    getDefaultBooleanValue,
    useDefaultQueryParams
} from '@/hooks/useDefaultQueryParams'
import { axiosPrivate } from '@/lib/axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ReadMealResponse } from '../../contract'
import { MEAL_KEYS } from '../keys'

interface ReadMealPath {
    mealId: string
}
interface ReadMealParams extends QueryParams<ReadMealPath> {}

export const readMeal = ({ path: { mealId } }: ReadMealParams): Promise<ReadMealResponse> =>
    axiosPrivate.get(`/meals/${mealId}`)

interface UseReadMealParams<T> extends DefaultQueryParams<ReadMealPath>, QueryOptions {
    select?: (response: ReadMealResponse) => T
}

export const useReadMeal = <T = ReadMealResponse>(params?: UseReadMealParams<T>) => {
    const defaultParams = useDefaultQueryParams(params)
    return useQuery({
        gcTime: 0,
        queryKey: MEAL_KEYS.resource(defaultParams.path.mealId),
        queryFn: () => readMeal(defaultParams),
        select: params?.select,
        enabled: Boolean(defaultParams.path.mealId) && getDefaultBooleanValue(params?.options?.enabled),
        placeholderData: getDefaultBooleanValue(params?.options?.keepPreviousData) ? keepPreviousData : undefined
    })
}
