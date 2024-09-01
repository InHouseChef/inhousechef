import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { ALACARD_MENU_KEYS } from '../keys'

interface DeleteALaCardMenuPath {
    aLaCardMenuId: string
}
interface DeleteALaCardMenuParams extends MutationParams<DeleteALaCardMenuPath> {}

export const deleteALaCardMenu = ({ path: { aLaCardMenuId } }: DeleteALaCardMenuParams) =>
    axiosPrivate.delete(`/alacard-menus/${aLaCardMenuId}`)

export const useDeleteALaCardMenu = () =>
    useMutation({
        mutationFn: deleteALaCardMenu,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ALACARD_MENU_KEYS.base })
    })
