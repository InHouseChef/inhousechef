import { axiosPrivate } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

const createLogout = () => axiosPrivate.post('/logout')

export const useCreateLogout = () =>
    useMutation({
        mutationFn: createLogout
    })
