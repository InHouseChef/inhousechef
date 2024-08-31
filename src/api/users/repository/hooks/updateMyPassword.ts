import { MY_USER_KEYS } from '@/keys'
import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateMyPasswordRequest } from '../../contract'

interface UpdateMyPasswordPath {
    companyCode: string
}
interface UpdateMyPasswordParams extends MutationParams<UpdateMyPasswordPath, UpdateMyPasswordRequest> {}

export const updateMyPassword = ({ path: { companyCode }, body }: UpdateMyPasswordParams) =>
    axiosPrivate.patch(`/companies/${companyCode}/users/me/password`, body)

export const useUpdateMyPassword = () =>
    useMutation({
        mutationFn: updateMyPassword,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: MY_USER_KEYS.base
            })
    })
