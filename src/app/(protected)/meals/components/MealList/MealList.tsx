'use client'
import { ReadMealResponse } from '@/api/meals'
import { useReadMeals } from '@/api/meals/repository/hooks/readMeals'
import { DataTable } from '@/components'
import { useDefaultQuery } from '@/hooks'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
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
                cell: props => <Link href={`/meals/${props.row.original.id}`}>{props.getValue()}</Link>
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
            column.accessor('type', {
                header: 'Type',
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
            <DataTable columns={columns as ColumnDef<ReadMealResponse, unknown>[]} data={meals?.results || []} />
        </div>
    )
}
