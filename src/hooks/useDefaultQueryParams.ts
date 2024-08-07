'use client'

import { DEFAULT_OFFSET_QUERY_REQUEST } from '@/constants'
import { DefaultOffsetQuery } from '@/packages/types'
import { DefaultPathParams, PathParams } from '@/types'
import { useParams } from 'next/navigation'

export interface QueryParams<TPath extends PathParams | void = void> {
    path: TPath
    query: DefaultOffsetQuery
}

export interface DefaultQueryParams<TPath extends PathParams> extends Partial<QueryParams<TPath>> {}

export interface QueryOptions {
    options?: {
        enabled?: boolean
        keepPreviousData?: boolean
    }
}

export interface QuerySelect<Data, Response> {
    select?: (data: Data) => Response
}

export const usePathParams = <T extends PathParams>(path?: T) => {
    const params = useParams<DefaultPathParams<T>>()
    const defaultPathParams: T = structuredClone(params) as T
    delete defaultPathParams['*']

    const _getPath = (path?: T): Readonly<Required<T>> =>
        (path ? { ...path, ...defaultPathParams } : defaultPathParams) as Required<T>
    return _getPath(path)
}

export const useQueryParams = (query?: DefaultOffsetQuery) => {
    const defaultQuery = structuredClone(DEFAULT_OFFSET_QUERY_REQUEST)
    const _getQuery = (query?: DefaultOffsetQuery): Readonly<DefaultOffsetQuery> =>
        query ? { ...defaultQuery, ...query } : defaultQuery
    const _query = _getQuery(query)

    return {
        getQuery: _getQuery,
        query: _query
    }
}

export const useDefaultQueryParams = <TPath extends PathParams>(params?: DefaultQueryParams<TPath>) => {
    const path = usePathParams<TPath>(params?.path)
    const { query } = useQueryParams(params?.query)

    return {
        path,
        query
    }
}

export const getDefaultBooleanValue = (enabled?: boolean, defaultParam: boolean = true) =>
    typeof enabled === 'boolean' ? enabled : defaultParam
