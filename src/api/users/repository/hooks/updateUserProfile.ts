import { axiosPrivate } from "@/lib/axios"
import { queryClient } from "@/lib/react-query"
import { MutationParams } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { USER_KEYS } from "../keys"
import { UpdateUserProfileRequest, UpdateUserProfileResponse } from "../../contract"

interface UpdateUserProfilePath {
    companyCode: string
    userId: string
}
interface UpdateUserProfileParams extends MutationParams<UpdateUserProfilePath, UpdateUserProfileRequest> {}

export const updateUserProfile = ({
    path: { companyCode, userId },
    body
}: UpdateUserProfileParams): Promise<UpdateUserProfileResponse> =>
    axiosPrivate.patch(`/companies/${companyCode}/users/${userId}/profile`, body)

export const useUpdateUserProfile = () =>
    useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: USER_KEYS.base
            })
    })