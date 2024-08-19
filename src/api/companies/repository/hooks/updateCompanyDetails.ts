import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { COMPANY_KEYS } from '..'
import { UpdateCompanyDetailsRequest, UpdateCompanyResponse } from '../..'

interface UpdateCompanyDetailsPath {
    companyCode: string
}
interface UpdateCompanyDetailsParams extends MutationParams<UpdateCompanyDetailsPath, UpdateCompanyDetailsRequest> {}

export const updateCompanyDetails = ({
    path: { companyCode },
    body
}: UpdateCompanyDetailsParams): Promise<UpdateCompanyResponse> =>
    axiosPrivate.patch(`/companies/${companyCode}/details`, body)

export const useUpdateCompanyDetails = () =>
    useMutation({
        mutationFn: updateCompanyDetails,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: COMPANY_KEYS.base
            })
    })
