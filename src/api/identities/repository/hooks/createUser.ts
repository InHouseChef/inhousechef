import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateUserRequest, CreateUserResponse } from '../../contract'

interface CreateUserPath {}
interface CreateUserParams extends MutationParams<CreateUserPath, CreateUserRequest> {}

export const createUser = ({ body }: CreateUserParams): Promise<CreateUserResponse> => axiosPrivate.post('/users', body)

export const useCreateUser = () => useMutation({ mutationFn: createUser })
