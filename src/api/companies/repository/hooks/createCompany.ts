import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateCompanyRequest, CreateCompanyResponse } from '../../contract'

interface CreateCompanyPath {}
interface CreateCompanyParams extends MutationParams<CreateCompanyPath, CreateCompanyRequest> {}

export const createCompany = ({ path: {}, body }: CreateCompanyParams): Promise<CreateCompanyResponse> =>
    axiosPrivate.post('/companies', body)

export const useCreateCompany = () => useMutation({ mutationFn: createCompany })
