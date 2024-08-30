import { useReadALaCardShift } from '@/api/alacard-shifts'
import { useReadShifts } from '@/api/shifts'
import { useReadMyUser } from '@/api/users'
import { Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { formatTimeWithoutSeconds } from '@/utils/date'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useCartStore } from '../../../../state'
import { sortShiftsByStartAt } from '../../../../utils'

export const ShiftSelectorNav = () => {
    const path = usePathParams<CompanyPath>()
    const { selectedShift, setSelectedShift, canImmediatelyOrder, aLaCardShift, setALaCardShift, canScheduleOrder } =
        useCartStore()
    const { data: shifts, isLoading } = useReadShifts()
    const { data: myUser, isLoading: isLoadingMyUser } = useReadMyUser({
        path
    })

    const { data, isLoading: isLoadingALaCardShift } = useReadALaCardShift({ path })

    useEffect(() => {
        if (!data) return
        setALaCardShift(data)
    }, [data])

    useEffect(() => {
        if (!shifts) return

        const firstAvailableShift = shifts.find(() => canScheduleOrder())
        console.log(firstAvailableShift)
        if (firstAvailableShift) {
            setSelectedShift(firstAvailableShift)
        }
    }, [shifts, canScheduleOrder, setSelectedShift])

    if (isLoading || isLoadingALaCardShift || isLoadingMyUser) return <Loader />

    const sortedShifts = sortShiftsByStartAt(shifts)

    return (
        // TODO: check why there is no horizontal scroll
        <nav className={clsx('topnav-horizontal h-10 min-h-10 border-gray-300')}>
            <ul className={clsx('flex h-full items-center justify-start gap-2')}>
                {myUser?.aLaCardPermission && data?.shiftStartAt ? (
                    <li className={clsx('relative text-center')}>
                        <Button
                            type='button'
                            disabled={!canImmediatelyOrder()}
                            onClick={() => {
                                setSelectedShift({
                                    companyId: data.companyId,
                                    shiftStartAt: data.shiftStartAt,
                                    id: data.id,
                                    shiftEndAt: data.shiftEndAt,
                                    name: '',
                                    orderingDeadlineBeforeShiftStart: 0
                                })
                                setALaCardShift(data)
                            }}
                            className={clsx('relative bg-green-500', {
                                'bg-green-500 hover:text-secondary': selectedShift?.id === data.id,
                                // 'bg-gray-300 text-black': selectedShift?.id !== data.id,
                                'cursor-not-allowed': !canImmediatelyOrder()
                            })}>
                            {formatTimeWithoutSeconds(aLaCardShift?.shiftStartAt || '')} -{' '}
                            {formatTimeWithoutSeconds(aLaCardShift?.shiftEndAt || '')}
                        </Button>
                    </li>
                ) : undefined}
                {sortedShifts?.map(({ id, shiftStartAt, shiftEndAt, ...rest }) => (
                    <li className={clsx('relative text-center')} key={id}>
                        <Button
                            type='button'
                            disabled={!canScheduleOrder()}
                            onClick={() => setSelectedShift({ ...rest, shiftStartAt, shiftEndAt, id })}
                            // TODO: make shifts take full width
                            className={clsx('relative', {
                                'bg-primary hover:text-secondary': selectedShift?.id === id,
                                'bg-gray-300 text-black': selectedShift?.id !== id,
                                'cursor-not-allowed': !canScheduleOrder()
                            })}>
                            {formatTimeWithoutSeconds(shiftStartAt)} - {formatTimeWithoutSeconds(shiftEndAt)}
                        </Button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
