import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { ORDER_KEYS } from '..'
import { DecreaseOrderItemQuantityResponse } from '../../contract'

interface DecreaseOrderItemQuantityPath {
    companyCode: string
    orderId: string
    skuId: string
}

interface DecreaseOrderItemQuantityParams extends MutationParams<DecreaseOrderItemQuantityPath> {}

export const decreaseOrderItemQuantity = ({
    path: { companyCode, orderId, skuId }
}: DecreaseOrderItemQuantityParams): Promise<DecreaseOrderItemQuantityResponse> =>
    axiosPrivate.patch(`/companies/${companyCode}/orders/${orderId}/items/${skuId}/decrease-quantity`)

export const useDecreaseOrderItemQuantity = () =>
    useMutation({
        mutationFn: decreaseOrderItemQuantity,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ORDER_KEYS.base
            })
    })
