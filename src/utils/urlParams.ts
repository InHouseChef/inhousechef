import { DEFAULT_CURSOR_PAGINATION_REQUEST, DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants'
import {
    CursorPaginationRequest,
    DefaultOffsetQuery,
    FilterRequest,
    OffsetPaginationRequest,
    SearchRequest,
    SortingRequest
} from '@/packages/types'
import { FieldValues } from 'react-hook-form'

export const encodeUrlParam = (param?: string | number | boolean) => (param ? encodeURIComponent(param) : undefined)
export const decodeUrlParam = (param?: string) => (param ? decodeURIComponent(param) : undefined)
export const searchParamToArrayOfStrings = (params?: string) => (params ? params.split(',') : [])

export const createUrlParams = (urlParams: FieldValues) => {
    const formattedUrlParams: FieldValues = {}
    Object.entries(urlParams).forEach(([key, value]) => {
        if (value && value.length) formattedUrlParams[key] = Array.isArray(value) ? value.join(',') : value
    })
    return new URLSearchParams(formattedUrlParams).toString()
}

export const createOffsetPaginationUrlParams = ({
    page,
    size
}: OffsetPaginationRequest = DEFAULT_OFFSET_PAGINATION_REQUEST) =>
    createUrlParams({ page: String(page), size: String(size) })

export const createCursorPaginationUrlParams = ({
    size,
    cursor
}: CursorPaginationRequest = DEFAULT_CURSOR_PAGINATION_REQUEST) =>
    createUrlParams({
        size: String(size),
        ...(cursor && { cursor })
    })

export const createSearchUrlParams = (search?: SearchRequest) => (search ? createUrlParams({ search }) : '')

export const mapSortingUrlParams = (sorting: SortingRequest): string =>
    sorting.map(s => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(';')

export const createSortingUrlParams = (sorting: SortingRequest = []) => {
    const values = Object.values(sorting)
    const sortBy = mapSortingUrlParams(values)
    return createUrlParams({ ...(sortBy && { sortBy }) })
}

export const createFilterUrlParams = (filter?: FilterRequest) => {
    if (!filter) return ''
    const copy = structuredClone(filter)
    Object.entries(copy).forEach(([key, value]) => {
        if (Array.isArray(value) && value.includes('true') && value.includes('false')) copy[key] = []
    })
    const values = Object.entries(copy).filter(([, value]) => {
        const isValueArray = Array.isArray(value)
        const isValueNumber = typeof value === 'number'
        return isValueNumber || (isValueArray && value.length) || !!value === value || (!isValueArray && value)
    })

    return new URLSearchParams(values as FilterRequest).toString()
}

export const createBaseUrlQuery = ({ pagination, search, sorting, filter }: DefaultOffsetQuery): string => {
    const paginationQuery = createOffsetPaginationUrlParams(pagination)
    const searchQuery = createSearchUrlParams(search)
    const sortingQuery = createSortingUrlParams(sorting)
    const filterQuery = createFilterUrlParams(filter)
    return [paginationQuery, searchQuery, sortingQuery, filterQuery].filter(query => query).join('&')
}
