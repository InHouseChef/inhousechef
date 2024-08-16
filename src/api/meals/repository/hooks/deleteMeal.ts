import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { MEAL_KEYS } from '../keys'

interface DeleteMealPath {
    mealId: string
}
interface DeleteMealParams extends MutationParams<DeleteMealPath> {}

const deleteMeal = ({ path: { mealId } }: DeleteMealParams) => axiosPrivate.delete(`/meals/${mealId}`)

export const useDeleteMeal = () =>
    useMutation({
        mutationFn: deleteMeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: MEAL_KEYS.base })
    })
