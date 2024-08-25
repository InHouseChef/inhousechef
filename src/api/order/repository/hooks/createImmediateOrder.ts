import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateImmediateOrderRequest, CreateImmediateOrderResponse } from '../../contract'

interface CreateImmediateOrderPath extends CompanyPath {}
interface CreateImmediateOrderParams extends MutationParams<CreateImmediateOrderPath, CreateImmediateOrderRequest> {}

export const createImmediateOrder = ({
    path: { companyCode },
    body
}: CreateImmediateOrderParams): Promise<CreateImmediateOrderResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/orders/immediate`, body)

export const useCreateImmediateOrder = () => useMutation({ mutationFn: createImmediateOrder })
