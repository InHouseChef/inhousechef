import { CursorPaginationRequest, DefaultOffsetQuery, OffsetPaginationRequest } from '@/packages/types'
import { FileTypes } from '@/types'

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
    size: 10
} as const

export const DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST: OffsetPaginationRequest = {
    page: 0,
    size: 9999
} as const

export const DEFAULT_CURSOR_PAGINATION_REQUEST: CursorPaginationRequest = {
    size: 10,
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

export const MAX_FILE_UPLOAD_SIZE = 5 * 1024 * 1024

export const MIME_TYPES: Record<FileTypes, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png'
}

export const DEFAULT_DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
}
export const LOGO_ACCEPTED_FILE_TYPES: FileTypes[] = ['jpg', 'jpeg', 'png']

export const APP_TIMEZONE = 'Europe/Belgrade'
