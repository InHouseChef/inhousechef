'use client'

import { ReadUserResponse, RolesEnum } from '@/api/users'
import { readUsers } from '@/api/users/repository/hooks/readUsers'
import { DataTable, Loader } from '@/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export const CompanyUserList = ({ params }: { params: { companyCode: string } }) => {
    const { companyCode } = params

    const [selectedRole, setSelectedRole] = useState<string>('All')
    const [selectedPermission, setSelectedPermission] = useState<string>('All')
    const [usersData, setUsersData] = useState<ReadUserResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [totalCount, setTotalCount] = useState<number>(0)

    // Fetch users based on selected filters
    const fetchUsers = () => {
        setIsLoading(true)
        const roleFilter = selectedRole !== 'All' ? selectedRole : undefined
        const permissionFilter = selectedPermission !== 'All' ? selectedPermission === 'true' : undefined

        readUsers({
            path: { companyCode },
            query: { filter: { role: roleFilter, aLaCardPermission: permissionFilter } }
        }).then(res => {
            setUsersData(res.results || [])
            setTotalCount(res.totalCount || 0)
            setIsLoading(false)
        }).catch(() => setIsLoading(false))
    }

    // Trigger fetch when filters change
    useEffect(() => {
        fetchUsers()
    }, [selectedRole, selectedPermission, companyCode])

    // Reset filters to default values
    const handleResetFilters = () => {
        setSelectedRole('All')
        setSelectedPermission('All')
        fetchUsers() // Fetch users with default filters
    }

    const column = createColumnHelper<ReadUserResponse>()
    const columns = useMemo(
        () => [
            column.accessor('fullName', {
                header: 'Name',
                enableSorting: false,
                cell: props => <Link href={`companies/${companyCode}/users/${props.row.original.id}`}>{props.getValue()}</Link>
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
                    <div className="flex justify-left items-center">
                        {props.getValue() ? (
                            <CheckCircle className="text-green-500" size={24} />
                        ) : (
                            <XCircle className="text-red-500" size={24} />
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
            <div className="flex items-center gap-4 mb-4">
                <Select onValueChange={setSelectedRole} value={selectedRole}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        <SelectItem value={RolesEnum.CompanyManager}>Company Manager</SelectItem>
                        <SelectItem value={RolesEnum.Employee}>Employee</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={setSelectedPermission} value={selectedPermission}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by A La Card Permission" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Permissions</SelectItem>
                        <SelectItem value="true">With Permission</SelectItem>
                        <SelectItem value="false">Without Permission</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
            </div>

            <div className="mb-4">
                <p>Total Users: {totalCount}</p>
            </div>

            <DataTable columns={columns as ColumnDef<ReadUserResponse, unknown>[]} data={usersData} />
        </div>
    )
}
