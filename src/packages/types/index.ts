export interface BaseResponse {
    id: string
    createdAt: string
    updatedAt: string
}

export interface Sorting {
    id: string
    desc: boolean
}

export type SearchRequest = string
export type SortingRequest = Sorting[]
export type FilterRequest = Record<string, any>

export type DatePartType = keyof Pick<
    Intl.DateTimeFormatPartTypesRegistry,
    'day' | 'dayPeriod' | 'era' | 'weekday' | 'month' | 'year' | 'timeZoneName'
>

export type DateFormatOptions = Pick<
    Intl.DateTimeFormatOptions,
    'calendar' | 'dateStyle' | 'day' | 'era' | 'timeZone' | 'month' | 'year' | 'timeZoneName' | 'weekday'
>

export interface DateFormatProps {
    options?: DateFormatOptions
    format?: DatePartType[]
    separator?: string
}

export type TimeFormatOptions = Pick<
    Intl.DateTimeFormatOptions,
    | 'hour'
    | 'hour12'
    | 'hourCycle'
    | 'fractionalSecondDigits'
    | 'minute'
    | 'second'
    | 'numberingSystem'
    | 'timeStyle'
    | 'timeZone'
    | 'timeZoneName'
    | 'dayPeriod'
>

export type TimePartType = keyof Pick<
    Intl.DateTimeFormatPartTypesRegistry,
    'hour' | 'minute' | 'second' | 'timeZoneName' | 'dayPeriod'
>

export type Cursor = string | undefined

export interface CursorPaginationRequest {
    size: number
    cursor: Cursor
}

export interface OffsetPaginationRequest {
    page: number
    size: number
}

export interface OffsetPaginationResponse {
    totalCount: number
    page: number
    size: number
}

export interface OffsetResults<T> extends OffsetPaginationResponse {
    results: T[]
}

export type OffsetResultsPromise<T> = Promise<OffsetResults<T>>

export interface DefaultOffsetQuery<TFilter = FilterRequest> {
    pagination?: OffsetPaginationRequest
    search?: SearchRequest
    sorting?: SortingRequest
    filter?: TFilter
}

export interface DefaultCursorQuery<TFilter = FilterRequest> {
    pagination?: CursorPaginationRequest
    search?: SearchRequest
    sorting?: SortingRequest
    filter?: TFilter
}
