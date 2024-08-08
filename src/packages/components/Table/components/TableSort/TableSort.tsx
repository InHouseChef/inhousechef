import * as React from 'react'
import { ReactNode, useEffect, useState } from 'react'

import { Header, SortingState } from '@tanstack/react-table'
import clsx from 'clsx'

export interface TableSortProps {
    header?: Header<any, unknown>
    label?: ReactNode | JSX.Element
    id?: string
    sorting?: SortingState
}

export const TableSort = ({ header, label, id, sorting }: TableSortProps) => {
    const [priority, setPriority] = useState<Number | undefined>()

    useEffect(() => {
        if (!sorting) return
        const priority = sorting.findIndex(item => item.id === id)

        if (priority !== -1) return setPriority(priority + 1)

        setPriority(undefined)
    }, [sorting])

    const handleSortClick = () => {
        const sortDirection = header?.column.getIsSorted()

        if (sortDirection === 'asc') return header?.column.toggleSorting(true, true)
        if (sortDirection === 'desc') return header?.column.clearSorting()

        return header?.column.toggleSorting(false, true)
    }

    return (
        <div
            className={clsx(
                'group/sort m-0 inline-flex max-w-max cursor-pointer items-center gap-1 border-0 bg-transparent p-0 outline-none'
            )}
            onClick={handleSortClick}>
            <div
                className={clsx(
                    'flex h-4 w-4 items-center justify-center rounded-sm text-white transition-colors',
                    {
                        'bg-primary': !!header?.column.getIsSorted(),
                        'bg-grey': !header?.column.getIsSorted()
                    },
                    {
                        'group-hover/sort:bg-primary': !!header?.column.getIsSorted(),
                        'group-hover/sort:bg-primary700': !header?.column.getIsSorted()
                    }
                )}>
                <svg
                    className={clsx('h-2.5 w-2.5 transform text-current transition-colors', {
                        'rotate-180': header?.column.getIsSorted() === 'asc',
                        'rotate-0': header?.column.getIsSorted() === 'desc'
                    })}
                    width='10'
                    height='10'
                    viewBox='0 0 10 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path d='M2.5 3.75L5 6.25L7.5 3.75' stroke='#F9FBFC' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            </div>
            {label}
            {typeof priority === 'number' ? (
                <div className='animate-zoomIn flex h-4 w-4 items-center justify-center rounded-sm bg-primary/15 text-xs text-primary'>
                    {priority}
                </div>
            ) : (
                <div className='mt-4' />
            )}
        </div>
    )
}
