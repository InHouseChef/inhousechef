import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateCompanyRequest, UpdateCompanyResponse } from '../../contract'
import { COMPANY_KEYS } from '../keys'

interface UpdateCompanyPath {
    companyId: string
}
interface UpdateCompanyParams extends MutationParams<UpdateCompanyPath, UpdateCompanyRequest> {}

export const updateCompany = ({ path: { companyId }, body }: UpdateCompanyParams): Promise<UpdateCompanyResponse> =>
    axiosPrivate.put(`/companies/${companyId}`, body)

export const useUpdateCompany = () =>
    useMutation({
        mutationFn: updateCompany,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: COMPANY_KEYS.base
            })
    })
