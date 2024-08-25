import { useAppDate } from '@/hooks'
import { toDateIso } from '@/utils/date'

interface DaySelectorNavProps {
    selectedDate: string
    onSelectDate: (date: string) => void
}

const DaySelectorNav = ({ selectedDate, onSelectDate }: DaySelectorNavProps) => {
    const { getAppDate } = useAppDate()
    const today = getAppDate()
    const tomorrowDate = new Date(today)
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    const tomorrow = toDateIso(tomorrowDate)

    return (
        <nav className='topnav-horizontal mx-2 h-14 min-h-14 bg-[#D9D9D9]'>
            <ul className='flex h-full items-center'>
                <li
                    className={`ml-2 flex-1 cursor-pointer py-2 text-center ${selectedDate === today ? 'bg-black text-white' : 'text-black'}`}
                    onClick={() => onSelectDate(today)}>
                    Danas
                </li>
                <li
                    className={`mr-2 flex-1 cursor-pointer py-2 text-center ${selectedDate === tomorrow ? 'bg-black text-white' : 'text-black'}`}
                    onClick={() => onSelectDate(tomorrow)}>
                    Sutra
                </li>
            </ul>
        </nav>
    )
}

export default DaySelectorNav