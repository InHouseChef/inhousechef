'use client'

import { ReadMealResponse } from '@/api/meals'
import { readMeals } from '@/api/meals/repository/hooks/readMeals'
import { DataTable, Header } from '@/components'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export const MealList = () => {
    const [selectedType, setSelectedType] = useState<string>('All')
    const [mealsData, setMealsData] = useState<ReadMealResponse[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(0)

    const router = useRouter()

    // Fetch meals based on selected filters, pagination size, and page
    const fetchMeals = () => {
        const typeFilter = selectedType !== 'All' ? selectedType : undefined

        readMeals({
            path: {},
            query: { filter: { type: typeFilter }, pagination: { page: currentPage, size: pageSize } }
        }).then(res => {
            setMealsData(res.results || [])
            setTotalCount(res.totalCount || 0)
        })
    }

    // Trigger fetch when filters, pagination size, or page change
    useEffect(() => {
        fetchMeals()
    }, [selectedType, pageSize, currentPage])

    // Reset filters to default values
    const handleResetFilters = () => {
        setSelectedType('All')
        setCurrentPage(0) // Reset to first page when filters change
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < Math.ceil(totalCount / pageSize)) {
            setCurrentPage(newPage)
        }
    }

    const column = createColumnHelper<ReadMealResponse>()
    const columns = useMemo(
        () => [
            column.accessor('name', {
                header: 'Meal Name',
                enableSorting: false,
                cell: props => <Link href={`/admin/meals/${props.row.original.id}`}>{props.getValue()}</Link>
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
            column.accessor('imageUrl', {
                header: '',
                enableSorting: false,
                cell: props =>
                    props.getValue() ? (
                        <img
                            src={props.getValue()}
                            alt='Meal Image'
                            className='h-12 w-12 rounded-lg border border-gray-200 object-cover'
                        />
                    ) : (
                        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200'>
                            <p className='text-center text-xs text-gray-500'>No Image</p>
                        </div>
                    )
            })
            // column.display({
            //     id: 'actions',
            //     header: '',
            //     cell: props => {
            //         const { id } = props.row.original
            //         return <div className='flex items-center justify-end gap-4'>{/* TODO: add actions */}</div>
            //     }
            // })
        ],
        [mealsData]
    )

    return (
        <div>
            <Header heading='Meals'>
                <Button type='button' onClick={() => router.push('/admin/meals/create')}>
                    Create Meal
                </Button>
            </Header>
            <div className='mt-4'></div>
            <div className='mb-4 flex items-center gap-4'>
                <Select onValueChange={setSelectedType} value={selectedType}>
                    <SelectTrigger>
                        <SelectValue placeholder='Filter by type' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>All Types</SelectItem>
                        <SelectItem value='MainCourse'>Main Course</SelectItem>
                        <SelectItem value='SideDish'>Side Dish</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant='outline' onClick={handleResetFilters}>
                    Reset Filters
                </Button>
            </div>

            <div className='mb-4'>
                <p>Total Meals: {totalCount}</p>
            </div>

            <DataTable columns={columns as ColumnDef<ReadMealResponse, unknown>[]} data={mealsData} />

            <div className='mt-4 flex w-32 justify-end'>
                <Select
                    onValueChange={value => {
                        setPageSize(Number(value))
                        setCurrentPage(0) // Reset to first page when page size changes
                    }}
                    value={String(pageSize)}>
                    <SelectTrigger>
                        <SelectValue placeholder='Meals per page' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='10'>10 per page</SelectItem>
                        <SelectItem value='25'>25 per page</SelectItem>
                        <SelectItem value='50'>50 per page</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='mt-4 flex justify-between'>
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                </Button>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalCount / pageSize) - 1}>
                    Next
                </Button>
            </div>
        </div>
    )
}
