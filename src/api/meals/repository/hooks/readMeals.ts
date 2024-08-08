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
import { ReadMealResponse } from '../../contract'
import { MEAL_KEYS } from '../keys'

interface ReadMealsPath {}
interface ReadMealsParams extends QueryParams<ReadMealsPath> {}

const readMeals = ({}: ReadMealsParams): OffsetResultsPromise<ReadMealResponse[]> => axiosPrivate.get('/meals')

interface UseReadMealsParams extends DefaultQueryParams<ReadMealsPath>, QueryOptions {}

export const useReadMeals = (params?: UseReadMealsParams) => {
    const defaultParams = useDefaultQueryParams({
        ...params,
        query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
    })

    return useQuery({
        queryKey: MEAL_KEYS.collection(defaultParams),
        queryFn: () => readMeals(defaultParams),
        enabled: getDefaultBooleanValue(params?.options?.enabled)
    })
}
