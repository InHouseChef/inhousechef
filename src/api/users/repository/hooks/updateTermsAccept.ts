import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateTermsAcceptRequest } from '../../contract'
import { USER_KEYS } from '../keys'

interface UpdateTermsAcceptPath {
    companyCode: string
}
interface UpdateTermsAcceptParams extends MutationParams<UpdateTermsAcceptPath, UpdateTermsAcceptRequest> {}

export const updateTermsAccept = ({ path: { companyCode }, body }: UpdateTermsAcceptParams) =>
    axiosPrivate.patch(`/companies/${companyCode}/me/terms/accept`, body)

export const useUpdateTermsAccept = () =>
    useMutation({
        mutationFn: updateTermsAccept,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.base
            })
    })
