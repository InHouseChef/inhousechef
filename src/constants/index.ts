import { CursorPaginationRequest, DefaultOffsetQuery, OffsetPaginationRequest } from '@/packages/types'

export const DEFAULT_QUERY_KEYS = (key: (string | undefined)[]) => {
    const keys = {
        base: [...key] as const,
        collections: () => [...keys.base, 'collections'] as const,
        collection: (parameters?: unknown) => [...keys.collections(), ...(parameters ? [parameters] : [])] as const,
        resources: () => [...keys.base, 'resources'] as const,
        resource: (parameters?: string) => [...keys.resources(), parameters] as const
    }
    return keys
}

export const DEFAULT_OFFSET_PAGINATION_REQUEST: OffsetPaginationRequest = {
    page: 0,
    size: 15
} as const

export const DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST: OffsetPaginationRequest = {
    page: 0,
    size: 9999
} as const

export const DEFAULT_CURSOR_PAGINATION_REQUEST: CursorPaginationRequest = {
    size: 15,
    cursor: undefined
} as const

export const DEFAULT_COLLECTION_CURSOR_PAGINATION_REQUEST: CursorPaginationRequest = {
    size: 9999,
    cursor: undefined
} as const

export const DEFAULT_OFFSET_QUERY_REQUEST: DefaultOffsetQuery = {
    search: '',
    pagination: DEFAULT_OFFSET_PAGINATION_REQUEST,
    sorting: [],
    filter: undefined
}
