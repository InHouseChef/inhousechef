import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateMealRequest, UpdateMealResponse } from '../../contract'
import { MEAL_KEYS } from '../keys'

interface UpdateMealPath {
    mealId: string
}
interface UpdateMealParams extends MutationParams<UpdateMealPath, UpdateMealRequest> {}

export const updateMeal = ({ path: { mealId }, body }: UpdateMealParams): Promise<UpdateMealResponse> =>
    axiosPrivate.put(`/companies/${mealId}`, body)

export const useUpdateMeal = () =>
    useMutation({
        mutationFn: updateMeal,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: MEAL_KEYS.base
            })
    })
