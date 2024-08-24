import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateOrderRequest, CreateOrderResponse } from '../../contract'

interface CreateOrderPath extends CompanyPath {}
interface CreateOrderParams extends MutationParams<CreateOrderPath, CreateOrderRequest> {}

export const createOrder = ({ path: { companyCode }, body }: CreateOrderParams): Promise<CreateOrderResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/orders`, body)

export const useCreateOrder = () => useMutation({ mutationFn: createOrder })
