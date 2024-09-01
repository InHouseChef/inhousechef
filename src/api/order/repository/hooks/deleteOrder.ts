import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { CompanyPath, MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { ORDER_KEYS } from '../keys'

interface DeleteOrderPath extends CompanyPath {
    orderId: string
}
interface DeleteOrderParams extends MutationParams<DeleteOrderPath> {}

const deleteOrder = ({ path: { companyCode, orderId } }: DeleteOrderParams) =>
    axiosPrivate.delete(`/companies/${companyCode}/orders/${orderId}`)

export const useDeleteOrder = () =>
    useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_KEYS.base })
    })
