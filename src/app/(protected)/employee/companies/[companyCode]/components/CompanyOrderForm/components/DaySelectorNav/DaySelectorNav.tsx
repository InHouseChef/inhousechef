import { useAppDate } from '@/hooks'
import { getTomorrowDateIso, toDateFromDateIso } from '@/utils/date'
import clsx from 'clsx'
import { useCartStore } from '../../../../state'

const DaySelectorNav = () => {
    const { selectedDate, setSelectedDate } = useCartStore()
    const { getAppDate } = useAppDate()
    const today = getAppDate()
    const tomorrow = getTomorrowDateIso(toDateFromDateIso(today))

    return (
        <nav className='topnav-horizontal mx-2 h-14 min-h-14 rounded-md bg-gray-100'>
            <ul className='flex h-full items-center'>
                <li
                    className={clsx('ml-2 flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-[#282828] text-white': selectedDate === today,
                        'text-black': selectedDate !== today
                    })}
                    onClick={() => setSelectedDate(today)}>
                    Za danas
                </li>
                <li
                    className={clsx('mr-2 flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-[#282828] text-white': selectedDate === tomorrow,
                        'text-black': selectedDate !== tomorrow
                    })}
                    onClick={() => setSelectedDate(tomorrow)}>
                    Za sutra
                </li>
            </ul>
        </nav>
    )
}

export default DaySelectorNav
