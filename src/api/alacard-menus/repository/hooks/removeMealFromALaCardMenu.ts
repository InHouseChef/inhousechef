import { axiosPrivate } from "@/lib/axios"
import { queryClient } from "@/lib/react-query"
import { MutationParams } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { ALACARD_MENU_KEYS } from "../keys"

interface RemoveMealFromALaCardMenuPath {
    aLaCardMenuId: string
    mealId: string
}
interface RemoveMealFromALaCardMenuParams extends MutationParams<RemoveMealFromALaCardMenuPath> {}

export const removeMealFromALaCardMenu = ({ path: { aLaCardMenuId, mealId } }: RemoveMealFromALaCardMenuParams) =>
    axiosPrivate.delete(`/aLaCard-menus/${aLaCardMenuId}/meals/${mealId}`)

export const useRemoveMealFromALaCardMenu = () =>
    useMutation({
        mutationFn: removeMealFromALaCardMenu,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ALACARD_MENU_KEYS.base })
    })