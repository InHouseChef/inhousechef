import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { IncrementOrderItemQuantityResponse } from '../../contract'

interface IncrementOrderItemQuantityPath extends CompanyPath {
    orderId: string
    skuId: string
}
interface IncrementOrderItemQuantityParams extends MutationParams<IncrementOrderItemQuantityPath> {}

const addIncrementOrderItemQuantity = ({
    path: { companyCode, orderId, skuId }
}: IncrementOrderItemQuantityParams): Promise<IncrementOrderItemQuantityResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/orders/${orderId}/items/${skuId}/add`)

export const useAddIncrementOrderItemQuantity = () => useMutation({ mutationFn: addIncrementOrderItemQuantity })
