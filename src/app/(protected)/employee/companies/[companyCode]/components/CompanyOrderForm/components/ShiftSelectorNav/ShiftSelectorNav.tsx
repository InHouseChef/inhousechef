import { useReadShifts } from '@/api/shifts'
import { Loader } from '@/components'
import clsx from 'clsx'
import { useCartStore } from '../../../../state'
import { sortShiftsByStartAt } from '../../../../utils'

export const ShiftSelectorNav = () => {
    const { selectedShiftId, setSelectedShift } = useCartStore()
    const { data: shifts, isLoading } = useReadShifts()

    if (isLoading) return <Loader />

    const sortedShifts = sortShiftsByStartAt(shifts)

    return (
        <nav className={clsx('topnav-horizontal h-8 min-h-8 border-b border-gray-300 bg-white')}>
            <ul className={clsx('flex h-full items-center bg-white')}>
                {sortedShifts?.map(({ id, name }) => (
                    <li className={clsx('relative flex-1 text-center')} key={id}>
                        <div
                            onClick={() => setSelectedShift(id)}
                            className={clsx(
                                'relative block border px-2 py-1 text-sm font-medium leading-6 text-gray-600 no-underline hover:text-primary',
                                { 'bg-primary text-white hover:text-secondary': selectedShiftId === id }
                            )}>
                            {name}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
