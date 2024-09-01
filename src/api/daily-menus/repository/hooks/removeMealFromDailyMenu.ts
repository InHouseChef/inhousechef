import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { DAILY_MENU_KEYS } from '../keys'

interface RemoveMealFromDailyMenuPath {
    dailyMenuId: string
    mealId: string
}
interface RemoveMealFromDailyMenuParams extends MutationParams<RemoveMealFromDailyMenuPath> {}

export const removeMealFromDailyMenu = ({ path: { dailyMenuId, mealId } }: RemoveMealFromDailyMenuParams) =>
    axiosPrivate.delete(`/daily-menus/${dailyMenuId}/meals/${mealId}`)

export const useRemoveMealFromDailyMenu = () =>
    useMutation({
        mutationFn: removeMealFromDailyMenu,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: DAILY_MENU_KEYS.base })
    })
