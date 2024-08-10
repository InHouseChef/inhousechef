import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { DAILY_MENU_KEYS } from '../keys'

interface DeleteDailyMenuPath {
    dailyMenuId: string
}
interface DeleteDailyMenuParams extends MutationParams<DeleteDailyMenuPath> {}

const deleteDailyMenu = ({ path: { dailyMenuId } }: DeleteDailyMenuParams) =>
    axiosPrivate.delete(`/daily-menus/${dailyMenuId}`)

export const useDeleteDailyMenu = () =>
    useMutation({
        mutationFn: deleteDailyMenu,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: DAILY_MENU_KEYS.base })
    })
