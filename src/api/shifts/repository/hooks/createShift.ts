import { axiosPrivate } from '@/lib/axios'
import { MutationParams } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { CreateShiftRequest, CreateShiftResponse } from '../../contract'

interface CreateShiftPath {}
interface CreateShiftParams extends MutationParams<CreateShiftPath, CreateShiftRequest> {}

export const createShift = ({ body }: CreateShiftParams): Promise<CreateShiftResponse> => axiosPrivate.post('/shifts/', body)

export const useCreateShift = () => useMutation({ mutationFn: createShift })
