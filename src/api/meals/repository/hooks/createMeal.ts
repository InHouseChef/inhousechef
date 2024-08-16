import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateMealRequest, CreateMealResponse } from '../../contract'

interface CreateMealPath {}
interface CreateMealParams extends MutationParams<CreateMealPath, CreateMealRequest> {}

export const createMeal = ({ path: {}, body }: CreateMealParams): Promise<CreateMealResponse> =>
    axiosPrivate.post('/meals/', body)

export const useCreateMeal = () => useMutation({ mutationFn: createMeal })
