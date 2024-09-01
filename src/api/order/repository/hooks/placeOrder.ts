import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { PlaceOrderResponse } from '../../contract'

interface PlaceOrderPath extends CompanyPath {
    orderId: string
}
interface PlaceOrderParams extends MutationParams<PlaceOrderPath> {}

export const placeOrder = ({ path: { companyCode, orderId } }: PlaceOrderParams): Promise<PlaceOrderResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/orders/${orderId}/status/placed`)

export const usePlaceOrder = () => useMutation({ mutationFn: placeOrder })
