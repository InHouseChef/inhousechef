import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { AddMealsToALaCardMenusRequest, AddMealsToALaCardMenusResponse } from '../../contract'

interface CreateALaCardMenuPath {}
interface CreateALaCardMenuParams extends MutationParams<CreateALaCardMenuPath, AddMealsToALaCardMenusRequest> {}

export const createALaCardMenu = ({ path: {}, body }: CreateALaCardMenuParams): Promise<AddMealsToALaCardMenusResponse> =>
    axiosPrivate.post('/alacard-menus/', body)

export const useCreateALaCardMenu = () => useMutation({ mutationFn: createALaCardMenu })
