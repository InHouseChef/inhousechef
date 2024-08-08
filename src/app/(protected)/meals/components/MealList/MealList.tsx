'use client'
import { ReadMealResponse } from '@/api/meals'
import { useReadMeals } from '@/api/meals/repository/hooks/readMeals'
import { useDefaultQuery } from '@/hooks'
import { Table } from '@/packages/components'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

export const MealList = () => {
    const { query, setFilter, setPagination, setSorting } = useDefaultQuery({}, true)
    const { data: meals, isLoading, isFetching } = useReadMeals()

    const column = createColumnHelper<ReadMealResponse>()
    const columns = useMemo(
        () => [
            column.accessor('name', {
                header: 'Meal Name',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),
            column.accessor('description', {
                header: 'Description',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),
            column.accessor('purchasePrice', {
                header: 'Purchase Price',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),
            column.accessor('sellingPrice', {
                header: 'Selling Price',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),

            column.display({
                id: 'actions',
                header: '',
                cell: props => {
                    const { id } = props.row.original

                    return <div className='flex items-center justify-end gap-4'>{/* TODO: add actions */}</div>
                }
            })
        ],
        [meals]
    )

    return (
        <div>
            <div className='mt-4'></div>
            <Table
                isFetching={isFetching}
                isLoading={isLoading}
                data={meals?.results}
                totalCount={meals?.totalCount}
                pagination={query.pagination}
                onPaginationChange={setPagination}
                sorting={query.sorting}
                onSortingChange={setSorting}
                columns={columns}
            />
        </div>
    )
}
