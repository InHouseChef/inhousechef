import { CreateLoginRequest, CreateLoginResponse } from '@/api/identities'
import { axiosPublic } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'

interface CreateLoginPath {}
interface CreateEndUserBasicParams extends MutationParams<CreateLoginPath, CreateLoginRequest> {}

export const createLogin = ({ body }: CreateEndUserBasicParams): Promise<CreateLoginResponse> =>
    axiosPublic.post('/login', body)

export const useCreateLogin = () =>
    useMutation({
        mutationFn: createLogin
    })
