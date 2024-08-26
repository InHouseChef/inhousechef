'use client'
import { Menu, OffsetPagination, TablePlaceholder } from '@/packages/components'
import { ColumnDef, flexRender, getCoreRowModel, OnChangeFn, SortingState, useReactTable } from '@tanstack/react-table'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { useSelection } from '@/packages/hooks'
import { BaseResponse, OffsetPaginationRequest } from '@/packages/types'
import { useElementBreakpoint } from '@/themes/utils/hooks'
import clsx from 'clsx'
import { Checkbox } from '../Form/components/Checkbox'
import { TableClearSort } from './components/TableClearSort'
import { TableSort } from './components/TableSort'

interface TableProps<T = any> {
    columns: ColumnDef<T, T>[]
    data?: T[]
    totalCount?: number
    pagination?: OffsetPaginationRequest
    onPaginationChange?: OnChangeFn<OffsetPaginationRequest>
    enableSorting?: boolean
    pageSizes?: number[]
    defaultPageSize?: number
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
    selectedRows?: string[]
    onRowSelect?: (value: string[]) => void
    isLoading?: boolean
    testIdAccessor?: keyof T | ((row: T) => string)
    className?: string
    isFetching?: boolean
    onRowClick?: (row: T) => void
}

export const Table = ({
    columns = [],
    data = [],
    pageSizes = [10, 25, 50, 100],
    totalCount,
    pagination,
    onPaginationChange,
    enableSorting = true,
    sorting,
    onSortingChange,
    selectedRows,
    onRowSelect,
    isLoading,
    testIdAccessor,
    className,
    isFetching,
    onRowClick
}: TableProps) => {
    const columnDefs: ColumnDef<any>[] = [...columns]
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const tablePaginationRef = useRef<HTMLDivElement>(null)
    const { width } = useElementBreakpoint({
        element: tablePaginationRef,
        breakpoints: { width: 576 },
        relationOperator: 'Smaller'
    })

    useEffect(() => {
        const isFirefox = /Firefox/i.test(navigator.userAgent)
        if (!isFirefox) return
        tablePaginationRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' })
    }, [data])

    const table = useReactTable({
        data,
        columns: columnDefs,
        state: {
            sorting
        },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        enableSorting,
        manualSorting: true,
        enableMultiSort: true,
        onSortingChange
    })

    const { isPageSelected, toggleAll, isSelected, toggleRow } = useSelection(data, selectedRows, onRowSelect)

    if (onRowSelect)
        columnDefs.unshift({
            id: crypto.randomUUID(),
            header: () => (
                <Checkbox
                    id={crypto.randomUUID()}
                    {...{
                        checked: isPageSelected,
                        onChange: event => toggleAll(event.currentTarget.checked)
                    }}
                />
            ),
            cell: ({ row }) => {
                const rowData = row.original as BaseResponse
                return (
                    <Checkbox
                        id={crypto.randomUUID()}
                        {...{
                            checked: isSelected(rowData),
                            onChange: () => toggleRow(rowData)
                        }}
                    />
                )
            }
        })

    return (
        <>
            {isLoading ? (
                <TablePlaceholder rows={pagination?.size} />
            ) : data.length ? (
                <>
                    <div className='relative'>
                        <div
                            className={`relative w-full flex-shrink-0 overflow-x-auto rounded-[9px] border border-[#f4f4ff] ${
                                className || ''
                            }`}>
                            <table className='isolate min-h-max w-full border-collapse'>
                                <thead className='sticky top-0 z-[5]'>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr className='group h-10 first:rounded-tl-lg' key={headerGroup.id}>
                                            {headerGroup.headers.map((header, index) => {
                                                const label = !header.isPlaceholder ? (
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                ) : (
                                                    <></>
                                                )
                                                return (
                                                    <th
                                                        key={header.id}
                                                        className={`group h-10 whitespace-nowrap bg-[#f4f4ff] px-3 py-1.5 text-left text-xs font-semibold last:rounded-tr-lg group-first:first:rounded-tl-lg group-first:last:rounded-tr-lg ${
                                                            header.column.getCanSort() ? 'sortable' : undefined
                                                        }`}>
                                                        <div className='flex group-[&>div.sortable]:cursor-pointer'>
                                                            {header.column.getCanSort() ? (
                                                                <TableSort
                                                                    sorting={sorting}
                                                                    id={header.id}
                                                                    header={header}
                                                                    label={label}
                                                                />
                                                            ) : (
                                                                label
                                                            )}
                                                            {index + 1 === headerGroup.headers.length ? (
                                                                <TableClearSort
                                                                    sorting={sorting}
                                                                    onReset={table.resetSorting}
                                                                />
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map(row => {
                                        const rowTestId = testIdAccessor
                                            ? typeof testIdAccessor === 'function'
                                                ? testIdAccessor(row.original)
                                                : row.original[testIdAccessor]
                                            : undefined

                                        return (
                                            <tr
                                                data-test-id={rowTestId}
                                                key={row.id}
                                                onClick={event => {
                                                    const target = event.target as HTMLElement
                                                    const isTableCellOrRow = ['TD', 'TR'].includes(target.tagName)
                                                    if (isTableCellOrRow && onRowClick) {
                                                        onRowClick(row.original)
                                                    }
                                                }}
                                                className={`border-b-secondary100 [&.selected]:bg-secondary200/50 group h-10 border-b bg-white last:border-b-0 ${
                                                    isSelected(row.original) ? 'selected' : ''
                                                }`}>
                                                {row.getVisibleCells().map(cell => (
                                                    <td
                                                        key={cell.id}
                                                        className={clsx(
                                                            'group-[&.selected] hover:bg-secondary200/50 group-hover:bg-primary200 group-even:[&.selected]:bg-secondary200/50 min-w-max px-3 py-1.5 group-last:first:rounded-bl-lg group-last:last:rounded-br-lg [&>a]:transition-colors [&>a]:hover:text-primary',
                                                            {
                                                                'first:width[44px]': !!onRowSelect
                                                            }
                                                        )}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <AnimatePresence>
                            {isFetching ? (
                                <div className="after:bg-gradient animate-fadeIn after:animate-loader after:bg-gradient-90 before:bg-primary400 relative w-full before:absolute before:-bottom-2 before:left-0 before:right-0 before:h-0.5 before:rounded-sm before:content-['*'] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-[200px] after:rounded-sm after:content-['']" />
                            ) : undefined}
                        </AnimatePresence>
                    </div>
                    {pagination && onPaginationChange ? (
                        <div
                            className='@container mt-4 flex items-center justify-between gap-10 md:items-center'
                            ref={tablePaginationRef}>
                            <div className='flex flex-row items-center gap-2.5 md:gap-5 lg:gap-10'>
                                {totalCount && totalCount > pageSizes[0] ? (
                                    <div className='flex flex-wrap items-center gap-2 sm:flex-nowrap'>
                                        <span className='@sm:block hidden'>Display</span>
                                        <Menu onChange={setIsDropdownOpen} placement='bottom' minWidth={0}>
                                            <Menu.Trigger>
                                                <div
                                                    className={clsx(
                                                        'flex items-center justify-center gap-1 rounded-lg border p-1 transition hover:border-primary',
                                                        {
                                                            'border-primary text-primary': isDropdownOpen,
                                                            'border-transparent': !isDropdownOpen
                                                        }
                                                    )}>
                                                    <span>{pagination.size}</span>{' '}
                                                    <Menu.TriggerChevron isOpen={isDropdownOpen} />
                                                </div>
                                            </Menu.Trigger>
                                            <Menu.Dropdown>
                                                {pageSizes.map(size => (
                                                    <Menu.Item
                                                        style={{ justifyContent: 'center' }}
                                                        key={size}
                                                        onClick={() => onPaginationChange({ page: 0, size })}>
                                                        {size}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Dropdown>
                                        </Menu>
                                        <span className='@sm:block hidden'>per page</span>
                                    </div>
                                ) : undefined}
                            </div>
                            {totalCount && pagination.size < totalCount ? (
                                <OffsetPagination
                                    totalCount={totalCount}
                                    pagination={pagination}
                                    onPaginationChange={onPaginationChange}
                                    showBoundaryPages={Boolean(width)}
                                    visiblePages={!width ? 3 : undefined}
                                />
                            ) : undefined}
                        </div>
                    ) : undefined}
                </>
            ) : (
                <div>
                    <p className='mt-3 text-2xl'>No results found</p>
                    <p className='text-grey mt-2'>We couldn&apos;t find what you&apos;re looking for</p>
                    <p className='text-grey'>Please try searching for another term.</p>
                </div>
            )}
        </>
    )
}
