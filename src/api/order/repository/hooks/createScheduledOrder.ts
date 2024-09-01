import { axiosPrivate } from '@/lib/axios'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateScheduledOrderRequest, CreateScheduledOrderResponse } from '../../contract'

interface CreateScheduledOrderPath extends CompanyPath {}
interface CreateScheduledOrderParams extends MutationParams<CreateScheduledOrderPath, CreateScheduledOrderRequest> {}

export const createScheduledOrder = ({
    path: { companyCode },
    body
}: CreateScheduledOrderParams): Promise<CreateScheduledOrderResponse> =>
    axiosPrivate.post(`/companies/${companyCode}/orders/scheduled`, body)

export const useCreateScheduledOrder = () => useMutation({ mutationFn: createScheduledOrder })
