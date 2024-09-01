import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { COMPANY_KEYS } from '..'
import { UpdateCompanyBrandingLogoRequest, UpdateCompanyResponse } from '../..'

interface UpdateCompanyBrandingLogoPath {
    companyCode: string
}
interface UpdateCompanyBrandingLogoParams
    extends MutationParams<UpdateCompanyBrandingLogoPath, UpdateCompanyBrandingLogoRequest> {}

export const updateCompanyBrandingLogo = ({
    path: { companyCode },
    body
}: UpdateCompanyBrandingLogoParams): Promise<UpdateCompanyResponse> =>
    axiosPrivate.patch(`/companies/${companyCode}/branding/logo`, body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const useUpdateCompanyBrandingLogo = () =>
    useMutation({
        mutationFn: updateCompanyBrandingLogo,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: COMPANY_KEYS.base
            })
    })
