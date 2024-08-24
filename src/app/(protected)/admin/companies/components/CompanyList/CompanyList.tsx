'use client'
import { ReadCompanyResponse } from '@/api/companies'
import { useReadCompanies } from '@/api/companies/repository/hooks/readCompanies'
import { DataTable, Header, Place } from '@/components'
import { Button } from '@/components/ui/button'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

export const CompanyList = () => {
    // const { query, setFilter, setPagination, setSorting } = useDefaultQuery({}, true)
    const { data: companies, isLoading, isFetching } = useReadCompanies()
    const router = useRouter()

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
            <Header heading='Companies'>
                <Button type='button' onClick={() => router.push('admin/companies/create')}>
                    Create Company
                </Button>
            </Header>
            <div className='mt-4'></div>
            <DataTable columns={columns as ColumnDef<ReadCompanyResponse, unknown>[]} data={companies?.results || []} />
        </div>
    )
}
