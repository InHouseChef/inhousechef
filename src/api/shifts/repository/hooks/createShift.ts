import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateShiftRequest, CreateShiftResponse } from '../../contract'

interface CreateShiftPath extends CompanyPath {}
interface CreateShiftParams extends MutationParams<CreateShiftPath, CreateShiftRequest> {}

export const createShift = ({ path: { companyCode }, body }: CreateShiftParams): Promise<CreateShiftResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/shifts`, body)

export const useCreateShift = () => useMutation({ mutationFn: createShift })
