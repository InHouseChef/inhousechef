import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateMealDetailsRequest, UpdateMealResponse } from '../../contract'
import { MEAL_KEYS } from '../keys'

interface UpdateMealDetailsPath {
    mealId: string
}
interface UpdateMealParams extends MutationParams<UpdateMealDetailsPath, UpdateMealDetailsRequest> {}

export const updateMealDetails = ({ path: { mealId }, body }: UpdateMealParams): Promise<UpdateMealResponse> =>
    axiosPrivate.patch(`/meals/${mealId}/details`, body)

export const useUpdateMealDetails = () =>
    useMutation({
        mutationFn: updateMealDetails,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: MEAL_KEYS.base
            })
    })
