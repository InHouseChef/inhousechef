'use client'
import { DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { DefaultOffsetQuery, FilterRequest, OffsetPaginationRequest, SearchRequest, SortingRequest } from '@/packages/types'
import { createUrlParams, isDeepEqualObject, mapSortingUrlParams } from '@/utils'
import { OnChangeFn } from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useIdentity } from '.'

export function useUrlParams<TFilter extends FilterRequest = FilterRequest>(
    params?: DefaultOffsetQuery<TFilter>,
    saveInUrl?: Boolean
) {
    const [filter, _setFilter] = useState<TFilter>((params?.filter as TFilter) || ({} as TFilter))
    const [sorting, _setSorting] = useState<SortingRequest>((params?.sorting as SortingRequest) || [])
    const [search, _setSearch] = useState<SearchRequest>((params?.search as SearchRequest) || '')

    const [pagination, setPagination] = useState<OffsetPaginationRequest>(
        params?.pagination || DEFAULT_OFFSET_PAGINATION_REQUEST
    )

    const searchParams = useSearchParams()
    const { identity } = useIdentity()
    const router = useRouter()

    const path = usePathname()

    const parseSortingParams = (sortString: string | null): SortingRequest => {
        if (!sortString) return []
        return sortString.split(';').map(pair => {
            const [id, direction] = pair.split(':')
            return {
                id,
                desc: direction === 'desc'
            }
        })
    }

    const updateStatesFromSearchParams = () => {
        const defaultFilter = params?.filter || ({} as TFilter)
        const defaultSorting = params?.sorting || []
        const defaultSearch = params?.search || ''
        const defaultPagination = params?.pagination || DEFAULT_OFFSET_PAGINATION_REQUEST

        const filterParam: TFilter = structuredClone(defaultFilter)
        const filterKeys = Array.from(searchParams.keys())
        let sortingParam: SortingRequest = []
        let searchParam = ''

        let pageParam = DEFAULT_OFFSET_PAGINATION_REQUEST.page
        let sizeParam = DEFAULT_OFFSET_PAGINATION_REQUEST.size

        filterKeys.forEach(key => {
            if (key === 'search') return (searchParam = searchParams.get(key) || '')
            if (key === 'size') return (sizeParam = Number(searchParams.get(key)) || DEFAULT_OFFSET_PAGINATION_REQUEST.size)
            if (key === 'page') return (pageParam = Number(searchParams.get(key)) || DEFAULT_OFFSET_PAGINATION_REQUEST.page)

            if (key === 'sortBy') return (sortingParam = parseSortingParams(searchParams.get(key)))

            for (const [key, value] of Object.entries(defaultFilter)) {
                const param = Array.isArray(value) ? searchParams.get(key)?.split(',') : searchParams.get(key)
                if (param) filterParam[key as keyof TFilter] = param as TFilter[keyof TFilter]
            }
        })

        const shouldUseUrl = filterKeys.length && saveInUrl

        setPagination(
            shouldUseUrl
                ? {
                      page: pageParam > 0 ? pageParam - 1 : 0,
                      size: sizeParam
                  }
                : defaultPagination
        )
        _setSorting(shouldUseUrl ? sortingParam : defaultSorting)
        _setFilter(shouldUseUrl ? filterParam : defaultFilter)
        _setSearch(shouldUseUrl ? searchParam : defaultSearch)
    }

    useEffect(() => updateStatesFromSearchParams(), [])

    const updateURL = () => {
        const formattedParams = createUrlParams({
            page: String(pagination.page + 1),
            size: String(pagination.size),
            search,
            sortBy: mapSortingUrlParams(sorting),
            ...filter
        })

        if (!identity) return
        router.replace(`${path}?${formattedParams}`)
    }

    useEffect(() => {
        if (!saveInUrl) return

        updateURL()
    }, [sorting, filter, search, pagination])

    const resetPagination = () =>
        setPagination({
            ...pagination,
            page: DEFAULT_OFFSET_PAGINATION_REQUEST.page
        })

    const setFilter = (filterValue: TFilter) => {
        if (isDeepEqualObject(filter, filterValue)) return
        _setFilter(filterValue)
        resetPagination()
    }

    const setSorting: OnChangeFn<SortingRequest> = sorting => {
        _setSorting(sorting)
        resetPagination()
    }

    const setSearch = (searchValue: SearchRequest) => {
        if (searchValue === search) return

        _setSearch(searchValue)
        resetPagination()
    }

    return {
        pagination,
        filter,
        sorting,
        search,
        setPagination,
        setFilter,
        setSorting,
        setSearch
    }
}
