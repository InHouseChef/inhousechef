import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { UpdateCompanyRequest, UpdateCompanyResponse } from '../../contract'
import { COMPANY_KEYS } from '../keys'

interface UpdateCompanyPath {
    companyCode: string
}
interface UpdateCompanyParams extends MutationParams<UpdateCompanyPath, UpdateCompanyRequest> {}

export const updateCompany = ({ path: { companyCode }, body }: UpdateCompanyParams): Promise<UpdateCompanyResponse> =>
    axiosPrivate.put(`/companies/${companyCode}`, body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const useUpdateCompany = () =>
    useMutation({
        mutationFn: updateCompany,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: COMPANY_KEYS.base
            })
    })
