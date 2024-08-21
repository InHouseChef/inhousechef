'use client'

import { readShifts } from '@/api/shifts/repository/hooks/readShifts'
import { DataTable, Loader } from '@/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'

export const ShiftList = ({ params }: { params: { companyCode: string } }) => {
    const { companyCode } = params
    const [shiftsData, setShiftsData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchShifts = () => {
        setIsLoading(true)
        readShifts({
            path: { companyCode, },
            query: {}
        }).then(res => {
            setShiftsData(res || [])
            setIsLoading(false)
        }).catch(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchShifts()
    }, [companyCode])

    const column = createColumnHelper<any>()
    const columns = useMemo(
        () => [
            column.accessor('name', {
                header: 'Name',
                cell: props => <Link href={`shifts/${props.row.original.id}`}>{props.getValue()}</Link>
            }),
            column.accessor('shiftStartAt', {
                header: 'Shift Start',
                cell: props => <p>{new Date(props.getValue()).toLocaleString()}</p>
            }),
            column.accessor('shiftEndAt', {
                header: 'Shift End',
                cell: props => <p>{new Date(props.getValue()).toLocaleString()}</p>
            }),
            column.accessor('orderingDeadlineBeforeShiftStart', {
                header: 'Order Deadline (Hours)',
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
        [companyCode]
    )

    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <div className="mb-4">
                <p>Total Shifts: {shiftsData.length}</p>
            </div>

            <DataTable columns={columns as ColumnDef<any, unknown>[]} data={shiftsData} />
        </div>
    )
}
