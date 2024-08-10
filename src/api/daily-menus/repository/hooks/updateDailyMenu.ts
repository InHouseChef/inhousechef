import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateDailyMenuRequest, UpdateDailyMenuResponse } from '../../contract'
import { DAILY_MENU_KEYS } from '../keys'

interface UpdateDailyMenuPath {
    dailyMenuId: string
}
interface UpdateDailyMenuParams extends MutationParams<UpdateDailyMenuPath, UpdateDailyMenuRequest> {}

export const updateDailyMenu = ({ path: { dailyMenuId }, body }: UpdateDailyMenuParams): Promise<UpdateDailyMenuResponse> =>
    axiosPrivate.put(`/companies/${dailyMenuId}`, body)

export const useUpdateDailyMenu = () =>
    useMutation({
        mutationFn: updateDailyMenu,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: DAILY_MENU_KEYS.base
            })
    })
