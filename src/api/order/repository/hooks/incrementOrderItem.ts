import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { IncrementOrderItemResponse } from '../../contract'

interface IncrementOrderItemPath extends CompanyPath {
    orderId: string
    skuId: string
}
interface IncrementOrderItemParams extends MutationParams<IncrementOrderItemPath> {}

const addIncrementOrderItem = ({
    path: { companyCode, orderId, skuId }
}: IncrementOrderItemParams): Promise<IncrementOrderItemResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/orders/${orderId}/items/${skuId}/add`)

export const useAddIncrementOrderItem = () => useMutation({ mutationFn: addIncrementOrderItem })
