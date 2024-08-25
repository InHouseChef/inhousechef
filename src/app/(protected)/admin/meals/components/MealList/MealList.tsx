'use client'

import { ReadMealResponse } from '@/api/meals'
import { readMeals } from '@/api/meals/repository/hooks/readMeals'
import { DataTable, Header, Loader } from '@/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

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

        readMeals({ query: { filter: { type: typeFilter }, pagination: { page: currentPage, size: pageSize } }}).then(res => {
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
                cell: props => (
                    props.getValue() ? (
                        <img
                            src={props.getValue()}
                            alt="Meal Image"
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-500 text-center">No Image</p>
                        </div>
                    )
                )
            }),
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
            <Header heading="Meals">
                <Button type='button' onClick={() => router.push('/admin/meals/create')}>
                    Create Meal
                </Button>
            </Header>
            <div className='mt-4'></div>
            <div className="flex items-center gap-4 mb-4">
                <Select onValueChange={setSelectedType} value={selectedType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="MainCourse">Main Course</SelectItem>
                        <SelectItem value="SideDish">Side Dish</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
            </div>

            <div className="mb-4">
                <p>Total Meals: {totalCount}</p>
            </div>

            <DataTable columns={columns as ColumnDef<ReadMealResponse, unknown>[]} data={mealsData} />

            <div className="flex justify-end mt-4 w-32">
                <Select onValueChange={value => {
                    setPageSize(Number(value))
                    setCurrentPage(0) // Reset to first page when page size changes
                }} value={String(pageSize)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Meals per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="25">25 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-between mt-4">
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                </Button>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= Math.ceil(totalCount / pageSize) - 1}>
                    Next
                </Button>
            </div>
        </div>
    )
}
