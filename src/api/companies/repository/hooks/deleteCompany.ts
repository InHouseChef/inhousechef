import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { COMPANY_KEYS } from '../keys'

interface DeleteCompanyPath {
    companyCode: string
}
interface DeleteCompanyParams extends MutationParams<DeleteCompanyPath> {}

export const deleteCompany = ({ path: { companyCode } }: DeleteCompanyParams) =>
    axiosPrivate.delete(`/companies/${companyCode}`)

export const useDeleteCompany = () =>
    useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.base })
    })
