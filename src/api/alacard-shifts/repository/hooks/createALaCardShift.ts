import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateALaCardShiftRequest, CreateALaCardShiftResponse } from '../../contract'

interface CreateShiftPath extends CompanyPath {}
interface CreateShiftParams extends MutationParams<CreateShiftPath, CreateALaCardShiftRequest> {}

export const createALaCardShift = ({
    path: { companyCode },
    body
}: CreateShiftParams): Promise<CreateALaCardShiftResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/a-la-card-shifts`, body)

export const useCreateALaCardShift = () => useMutation({ mutationFn: createALaCardShift })
