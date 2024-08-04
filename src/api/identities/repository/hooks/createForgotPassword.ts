import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateForgotPasswordRequest } from '../..'

interface CreateForgotPasswordPath {}
interface CreateForgotPasswordParams extends MutationParams<CreateForgotPasswordPath, CreateForgotPasswordRequest> {}

const createForgotPassword = ({ path, body }: CreateForgotPasswordParams) => axiosPrivate.post('/forgot-password', body)

export const useCreateForgotPassword = () =>
    useMutation({
        mutationFn: createForgotPassword
    })
