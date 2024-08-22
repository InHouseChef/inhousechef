import { useReadShifts } from '@/api/shifts'
import { Loader } from '@/components'
import { toTimeFromString } from '@/utils/date'
import clsx from 'clsx'

interface ShiftSelectorNavProps {
    activeShiftId: string
    onShiftSelect: (shift: string) => void
}

export const ShiftSelectorNav = ({ activeShiftId, onShiftSelect }: ShiftSelectorNavProps) => {
    const { data: shifts, isLoading } = useReadShifts()

    if (isLoading) return <Loader />

    const sortedShiftsByStartAt = shifts?.sort(
        (a, b) => toTimeFromString(a.shiftStartAt).getTime() - toTimeFromString(b.shiftStartAt).getTime()
    )

    return (
        <nav className={clsx('topnav-horizontal h-8 min-h-8 border-b border-gray-300 bg-white')}>
            <ul className={clsx('flex h-full items-center bg-white')}>
                {sortedShiftsByStartAt?.map(({ id, name }) => (
                    <li className={clsx('relative flex-1 text-center')} key={id}>
                        <div
                            onClick={() => onShiftSelect(id)}
                            className={clsx(
                                'relative block border px-2 py-1 text-sm font-medium leading-6 text-gray-600 no-underline hover:text-primary',
                                { 'bg-green-500 text-white hover:text-secondary': activeShiftId === id }
                            )}>
                            {name}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}