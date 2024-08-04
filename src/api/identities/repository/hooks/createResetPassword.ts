import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateResetPasswordRequest } from '../..'

interface CreateResetPasswordPath {}
interface CreateResetPasswordParams extends MutationParams<CreateResetPasswordPath, CreateResetPasswordRequest> {}

const createResetPassword = ({ body }: CreateResetPasswordParams) => axiosPrivate.post('/reset-password', body)

export const useCreateResetPassword = () =>
    useMutation({
        mutationFn: createResetPassword
    })
