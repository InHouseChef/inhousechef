import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateDailyMenuRequest, CreateDailyMenuResponse } from '../../contract'

interface CreateDailyMenuPath {}
interface CreateDailyMenuParams extends MutationParams<CreateDailyMenuPath, CreateDailyMenuRequest> {}

export const createDailyMenu = ({ path: {}, body }: CreateDailyMenuParams): Promise<CreateDailyMenuResponse> =>
    axiosPrivate.post('/daily-menus/', body)

export const useCreateDailyMenu = () => useMutation({ mutationFn: createDailyMenu })
