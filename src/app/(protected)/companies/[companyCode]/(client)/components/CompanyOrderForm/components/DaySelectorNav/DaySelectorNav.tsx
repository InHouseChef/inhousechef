import clsx from 'clsx'
import { UpcomingDailyMenuDate } from '../../../../utils'

interface DaySelectorNavProps {
    dates: UpcomingDailyMenuDate[]
    selectedDate: string
    onSelectDate: (date: string) => void
}

const DaySelectorNav = ({ dates, selectedDate, onSelectDate }: DaySelectorNavProps) => {
    return (
        <div className='flex flex-1 flex-col'>
            {dates.map(({ available, disabled, day, name, date }, index) => (
                <button
                    disabled={!available || disabled}
                    key={index}
                    onClick={() => onSelectDate(date)}
                    className={clsx(
                        'flex flex-1 cursor-pointer flex-col items-center justify-center border px-4 py-3',
                        date === selectedDate ? 'bg-indigo-600 text-white' : '',
                        available ? (disabled ? 'bg-gray-300 text-black' : 'text-black') : 'bg-gray-400 text-gray-800'
                    )}>
                    <span
                        className={clsx(
                            'text-sm font-medium',
                            date === selectedDate ? 'text-white' : available && !disabled && 'text-black'
                        )}>
                        {day}
                    </span>
                    <span
                        className={clsx(
                            'text-xs font-semibold',
                            date === selectedDate ? 'text-white' : available && !disabled ? 'text-black' : 'text-gray-800'
                        )}>
                        {name}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default DaySelectorNav
