'use client'

import { ReadUserResponse, RolesEnum } from '@/apis/users'
import { readUsers } from '@/apis/users/repository/hooks/readUsers'
import { DataTable, Loader } from '@/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { CheckCircle2Icon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export const UserList = ({ params }: { params: { companyCode: string } }) => {
    const { companyCode } = params

    const [selectedRole, setSelectedRole] = useState<string>('All')
    const [selectedPermission, setSelectedPermission] = useState<string>('All')
    const [usersData, setUsersData] = useState<ReadUserResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [totalCount, setTotalCount] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(0)

    // Fetch users based on selected filters, pagination size, and page
    const fetchUsers = () => {
        setIsLoading(true)
        const roleFilter = selectedRole !== 'All' ? selectedRole : undefined
        const permissionFilter = selectedPermission !== 'All' ? selectedPermission === 'true' : undefined

        readUsers({
            path: { companyCode },
            query: {
                filter: { role: roleFilter, aLaCardPermission: permissionFilter },
                pagination: { page: currentPage, size: pageSize }
            }
        })
            .then(res => {
                setUsersData(res.results || [])
                setTotalCount(res.totalCount || 0)
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }

    // Trigger fetch when filters, pagination size, or page change
    useEffect(() => {
        fetchUsers()
    }, [selectedRole, selectedPermission, pageSize, currentPage, companyCode])

    // Reset filters to default values
    const handleResetFilters = () => {
        setSelectedRole('All')
        setSelectedPermission('All')
        setCurrentPage(0) // Reset to first page when filters change
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < Math.ceil(totalCount / pageSize)) {
            setCurrentPage(newPage)
        }
    }

    const column = createColumnHelper<ReadUserResponse>()
    const columns = useMemo(
        () => [
            column.accessor('fullName', {
                header: 'Name',
                enableSorting: false,
                cell: props => <Link href={`users/${props.row.original.id}`}>{props.getValue()}</Link>
            }),
            column.accessor('username', {
                header: 'Username',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),
            column.accessor('role', {
                header: 'Role',
                enableSorting: false,
                cell: props => <p>{props.getValue()}</p>
            }),
            column.accessor('aLaCardPermission', {
                header: 'A La Card Permission',
                enableSorting: false,
                cell: props => (
                    <div className='justify-left flex items-center'>
                        {props.getValue() ? (
                            <CheckCircle2Icon  className='text-green-500' size={24} />
                        ) : (
                            <CheckCircle2Icon size={24} />
                        )}
                    </div>
                )
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
        [companyCode]
    )

    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                <Select onValueChange={setSelectedRole} value={selectedRole}>
                    <SelectTrigger>
                        <SelectValue placeholder='Filter by role' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>All Roles</SelectItem>
                        <SelectItem value={RolesEnum.CompanyManager}>Menadžer</SelectItem>
                        <SelectItem value={RolesEnum.Employee}>Radnik</SelectItem>
                        <SelectItem value={RolesEnum.RestaurantWorker}>Restoranski radnik</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={setSelectedPermission} value={selectedPermission}>
                    <SelectTrigger>
                        <SelectValue placeholder='Filter by A La Card Permission' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>All Permissions</SelectItem>
                        <SelectItem value='true'>With Permission</SelectItem>
                        <SelectItem value='false'>Without Permission</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant='outline' onClick={handleResetFilters}>
                    Reset Filters
                </Button>
            </div>

            <div className='mb-4'>
                <p>Total Users: {totalCount}</p>
            </div>

            <DataTable columns={columns as ColumnDef<ReadUserResponse, unknown>[]} data={usersData} />

            <div className='mt-4 flex w-32 justify-end'>
                <Select
                    onValueChange={value => {
                        setPageSize(Number(value))
                        setCurrentPage(0) // Reset to first page when page size changes
                    }}
                    value={String(pageSize)}>
                    <SelectTrigger>
                        <SelectValue placeholder='Users per page' />
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
