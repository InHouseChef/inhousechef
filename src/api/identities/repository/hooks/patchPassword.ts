import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdatePasswordRequest } from '../..'

interface PatchPasswordPath {}
interface PatchPasswordParams extends MutationParams<PatchPasswordPath, UpdatePasswordRequest> {}

const patchPassword = ({ body }: PatchPasswordParams) => axiosPrivate.patch('/password', body)

export const usePatchPassword = () =>
    useMutation({
        mutationFn: patchPassword
    })
