import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
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

export const useUpdateCompany = () => {
    const router = useRouter()

    useMutation({
        mutationFn: updateCompany,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: COMPANY_KEYS.base
            })
            router.replace(`/companies/${variables.path.companyCode}`)
        }
    })
}
