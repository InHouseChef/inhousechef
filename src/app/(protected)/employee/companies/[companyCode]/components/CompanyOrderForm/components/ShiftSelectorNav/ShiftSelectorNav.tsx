import { useReadALaCardShift } from '@/api/alacard-shifts'
import { useReadShifts } from '@/api/shifts'
import { Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { useAppDate, usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { formatTimeWithoutSeconds, toDateFromDateIso } from '@/utils/date'
import clsx from 'clsx'
import { useCartStore } from '../../../../state'
import { canScheduleOrder, sortShiftsByStartAt } from '../../../../utils'

export const ShiftSelectorNav = () => {
    const path = usePathParams<CompanyPath>()
    const { selectedShiftId, setSelectedShift } = useCartStore()
    const { data: shifts, isLoading } = useReadShifts()
    const { selectedDate } = useCartStore()
    const { getAppDateTime } = useAppDate()
    // const { data: myUser, isLoading: isLoadingMyUser } = useReadMyUser({
    //     path
    // })

    const { data: aLaCardShift, isLoading: isLoadingALaCardShift } = useReadALaCardShift()

    // TODO: add a la carte shift based on permission

    if (isLoading || isLoadingALaCardShift) return <Loader />

    const sortedShifts = sortShiftsByStartAt(shifts)

    return (
        <nav className={clsx('topnav-horizontal h-10 min-h-10 border-gray-300')}>
            <ul className={clsx('flex h-full items-center')}>
                {/* {myUser?.aLaCardPermission ? (
                    <li className={clsx('relative flex-1 text-center')}>
                        <Button
                            type='button'
                            disabled={canImmediatelyOrder(aLaCardShift, new Date())}
                            className={clsx('relative bg-green-200 text-black')}>
                            A La Carte
                        </Button>
                    </li>
                ) : undefined} */}
                {sortedShifts?.map(({ id, shiftStartAt, shiftEndAt, ...rest }) => (
                    <li className={clsx('relative flex-1 text-center')} key={id}>
                        <Button
                            type='button'
                            disabled={
                                !canScheduleOrder(
                                    {
                                        ...rest,
                                        shiftStartAt,
                                        shiftEndAt,
                                        id
                                    },
                                    getAppDateTime()
                                )
                            }
                            onClick={() => setSelectedShift(id)}
                            className={clsx('relative flex-1', {
                                'bg-primary hover:text-secondary': selectedShiftId === id,
                                'bg-gray-300 text-black': selectedShiftId !== id,
                                'cursor-not-allowed': !canScheduleOrder(
                                    {
                                        ...rest,
                                        shiftStartAt,
                                        shiftEndAt,
                                        id
                                    },
                                    toDateFromDateIso(selectedDate)
                                )
                            })}>
                            {formatTimeWithoutSeconds(shiftStartAt)} - {formatTimeWithoutSeconds(shiftEndAt)}
                        </Button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
