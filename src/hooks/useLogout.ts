'use client'

import { useCreateLogout } from '@/api/logins'
import { queryClient } from '@/lib/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useBaseUrl } from '.'
import { useIdentity } from './useIdentity'

export const useLogout = () => {
    const { setIdentity } = useIdentity()
    const { baseUrl } = useBaseUrl()

    const router = useRouter()
    const { mutate } = useCreateLogout()

    useEffect(() => {
        router.prefetch(`${baseUrl}/login`)
    }, [router])

    return () => {
        mutate(undefined, {
            onSettled: () => {
                Promise.all([setIdentity(null), queryClient.removeQueries(), router.replace(baseUrl)])
            }
        })
    }
}
