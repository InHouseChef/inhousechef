'use client'

import { ReadCompanyResponse } from '@/api/companies'
import { DataTable, Header, Loader, Place } from '@/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { readCompanies } from '@/api/companies/repository/hooks/readCompanies'
import { useRouter } from 'next/navigation'

export const CompanyList = () => {
    const [companiesData, setCompaniesData] = useState<ReadCompanyResponse[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(0)

    const router = useRouter()

    // Fetch companies based on pagination size and page
    const fetchCompanies = () => {
        readCompanies({ query: { pagination: { page: currentPage, size: pageSize } }})
        .then(res => {
            setCompaniesData(res.results || [])
            setTotalCount(res.totalCount || 0)
        })
    }

    // Trigger fetch when pagination size or page changes
    useEffect(() => {
        fetchCompanies()
    }, [pageSize, currentPage])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < Math.ceil(totalCount / pageSize)) {
            setCurrentPage(newPage)
        }
    }

    const column = createColumnHelper<ReadCompanyResponse>()
    const columns = useMemo(
        () => [
            column.accessor('name', {
                header: 'Company Name',
                enableSorting: false,
                cell: props => <Link href={`/admin/companies/${props.row.original.code}`}>{props.getValue()}</Link>
            }),
            column.accessor('telephone', {
                header: 'Phone Number',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),
            column.accessor('address', {
                header: 'Address',
                enableSorting: false,
                cell: props => (props.getValue() ? <Place address={props.getValue()} /> : undefined)
            }),
            column.accessor('branding.logoUrl', {
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
            //     cell: props => (
            //         <div className='flex items-center justify-end gap-4'>
            //             {/* TODO: add actions */}
            //             Access
            //         </div>
            //     )
            // })
        ],
        [companiesData]
    )

    return (
        <div>
            <Header heading='Companies'>
                <Button type='button' onClick={() => router.push('/admin/companies/create')}>
                    Create Company
                </Button>
            </Header>
            <div className="mb-4">
                <p>Total Companies: {totalCount}</p>
            </div>

            <DataTable columns={columns as ColumnDef<ReadCompanyResponse, unknown>[]} data={companiesData} />

            <div className="flex justify-end mt-4 w-32">
                <Select onValueChange={value => {
                    setPageSize(Number(value))
                    setCurrentPage(0) // Reset to first page when page size changes
                }} value={String(pageSize)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Companies per page" />
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
