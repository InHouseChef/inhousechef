'use client'
import { ReadCompanyResponse } from '@/api/companies'
import { useReadCompanies } from '@/api/companies/repository/hooks/readCompanies'
import { DataTable, Place } from '@/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo } from 'react'

export const CompanyList = () => {
    // const { query, setFilter, setPagination, setSorting } = useDefaultQuery({}, true)
    const { data: companies, isLoading, isFetching } = useReadCompanies()

    const column = createColumnHelper<ReadCompanyResponse>()
    const columns = useMemo(
        () => [
            column.accessor('name', {
                header: 'Company Name',
                enableSorting: false,
                cell: props => <Link href={`/companies/${props.row.original.code}`}>{props.getValue()}</Link>
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

            column.display({
                id: 'actions',
                header: '',
                cell: props => {
                    const { id } = props.row.original

                    return (
                        <div className='flex items-center justify-end gap-4'>
                            {/* TODO: add actions */}
                            Access
                        </div>
                    )
                }
            })
        ],
        [companies]
    )

    return (
        <div>
            <div className='mt-4'></div>
            {/* TODO: check this */}
            <DataTable columns={columns as ColumnDef<ReadCompanyResponse, unknown>[]} data={companies?.results || []} />
            {/* <Table
                isFetching={isFetching}
                isLoading={isLoading}
                data={companies?.results}
                totalCount={companies?.totalCount}
                pagination={query.pagination}
                onPaginationChange={setPagination}
                sorting={query.sorting}
                onSortingChange={setSorting}
                columns={columns}
            /> */}
        </div>
    )
}
