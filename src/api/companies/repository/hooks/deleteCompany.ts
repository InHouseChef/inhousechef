import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { COMPANY_KEYS } from '../keys'

interface DeleteCompanyPath {
    companyId: string
}
interface DeleteCompanyParams extends MutationParams<DeleteCompanyPath> {}

const deleteCompany = ({ path: { companyId } }: DeleteCompanyParams) => axiosPrivate.delete(`/companies/${companyId}`)

export const useDeleteCompany = () =>
    useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.base })
    })
