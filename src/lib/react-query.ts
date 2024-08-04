import { DefaultOptions, QueryCache, QueryClient } from '@tanstack/react-query'

const defaultOptions: DefaultOptions = {
    queries: {
        retry: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    }
}

const queryCache: QueryCache = new QueryCache({})

export const queryClient = new QueryClient({ defaultOptions, queryCache })
