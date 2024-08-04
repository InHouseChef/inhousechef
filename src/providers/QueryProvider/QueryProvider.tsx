'use client'

import { queryClient } from '@/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

interface QueryProviderProps {
    children?: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {/* {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />} */}
            {children}
        </QueryClientProvider>
    )
}
