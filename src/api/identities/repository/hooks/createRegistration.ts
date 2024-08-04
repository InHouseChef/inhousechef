import { axiosPrivate } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { CreateRegistrationRequest, CreateRegistrationResponse } from '../../contract'

interface CreateRegistrationParams {
    body: CreateRegistrationRequest
}

export const createRegistration = ({ body }: CreateRegistrationParams): Promise<CreateRegistrationResponse> =>
    axiosPrivate.post('/identity', body)

export const useCreateRegistration = () => useMutation({ mutationFn: createRegistration })
