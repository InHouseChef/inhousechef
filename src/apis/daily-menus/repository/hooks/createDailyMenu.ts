import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { AddMealsToDailyMenusRequest, AddMealsToDailyMenusResponse } from '../../contract'

interface CreateDailyMenuPath {}
interface CreateDailyMenuParams extends MutationParams<CreateDailyMenuPath, AddMealsToDailyMenusRequest> {}

export const createDailyMenu = ({ path: {}, body }: CreateDailyMenuParams): Promise<AddMealsToDailyMenusResponse> =>
    axiosPrivate.post('/daily-menus/', body)

export const useCreateDailyMenu = () => useMutation({ mutationFn: createDailyMenu })
