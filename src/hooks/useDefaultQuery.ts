'use client'
import { DefaultOffsetQuery, FilterRequest } from '@/packages/types'
import { useRef } from 'react'
import { useUrlParams } from './useUrlParams'

export function useDefaultQuery<TFilter extends FilterRequest = FilterRequest>(
    params?: DefaultOffsetQuery<TFilter>,
    saveInUrl?: boolean
) {
    const { filter, setFilter, search, setSearch, sorting, setSorting, pagination, setPagination } = useUrlParams<TFilter>(
        params,
        saveInUrl
    )

    const query = {
        pagination,
        search,
        sorting,
        filter
    }

    const _defaultQuery = useRef(structuredClone(query))

    return {
        query,
        defaultQuery: _defaultQuery.current,
        setPagination,
        setSearch,
        setSorting,
        setFilter
    }
}
