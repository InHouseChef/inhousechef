import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { USER_KEYS } from '../keys'
import { UpdateUserALaCardPermissionRequest, UpdateUserALaCardPermissionResponse } from '../../contract'

interface UpdateUserALaCardPermissionPath {
    companyCode: string
    userId: string
}
interface UpdateUserALaCardPermissionParams
    extends MutationParams<UpdateUserALaCardPermissionPath, UpdateUserALaCardPermissionRequest> {}

export const updateUserALaCardPermission = ({
    path: { companyCode, userId },
    body
}: UpdateUserALaCardPermissionParams): Promise<UpdateUserALaCardPermissionResponse> =>
    axiosPrivate.patch(`/companies/${companyCode}/users/${userId}/aLaCard`, body)

export const useUpdateUserALaCardPermission = () =>
    useMutation({
        mutationFn: updateUserALaCardPermission,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.base
            })
    })
