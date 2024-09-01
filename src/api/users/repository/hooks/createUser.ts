import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateUserRequest, CreateUserResponse } from '../../contract'

interface CreateUserPath extends CompanyPath {}
interface CreateUserParams extends MutationParams<CreateUserPath, CreateUserRequest> {}

export const createUser = ({ path: { companyCode }, body }: CreateUserParams): Promise<CreateUserResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/users`, body)

export const useCreateUser = () => useMutation({ mutationFn: createUser })
