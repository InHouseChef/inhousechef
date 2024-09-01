import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { COMPANY_KEYS } from '..'
import { UpdateCompanyBrandingColorsRequest, UpdateCompanyResponse } from '../..'

interface UpdateCompanyBrandingColorsPath {
    companyCode: string
}
interface UpdateCompanyBrandingColorsParams
    extends MutationParams<UpdateCompanyBrandingColorsPath, UpdateCompanyBrandingColorsRequest> {}

export const updateCompanyBrandingColors = ({
    path: { companyCode },
    body
}: UpdateCompanyBrandingColorsParams): Promise<UpdateCompanyResponse> =>
    axiosPrivate.patch(`/companies/${companyCode}/branding/colors`, body)

export const useUpdateCompanyBrandingColors = () =>
    useMutation({
        mutationFn: updateCompanyBrandingColors,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: COMPANY_KEYS.base
            })
    })
