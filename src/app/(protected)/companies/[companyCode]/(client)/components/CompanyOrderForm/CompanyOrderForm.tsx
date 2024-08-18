import { useReadDailyMenus } from '@/api/daily-menus/repository/hooks/readDailyMenus'
import clsx from 'clsx'
import { Loader, ShoppingCartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateUpcomingDates } from '../../utils'

export const CompanyOrderForm = () => {
    const { data: dailyMenus, isLoading: isLoadingDailyMenus } = useReadDailyMenus()
    const [dates, setDates] = useState<
        { day: string; name: string; dateString: string; available: boolean; disabled: boolean }[]
    >([])

    useEffect(() => {
        const today = new Date()
        const upcomingDates = generateUpcomingDates(today, dailyMenus)
        setDates(upcomingDates)
    }, [dailyMenus])

    if (isLoadingDailyMenus) return <Loader />

    return (
        <div className='flex h-full'>
            <div className='flex flex-col items-center'>
                <div className='flex items-center justify-center border bg-black px-4 py-3'>
                    <ShoppingCartIcon className='text-white' />
                </div>
                {dates.map((date, index) => (
                    <div
                        key={index}
                        className={clsx(
                            'flex flex-1 flex-col items-center justify-center border px-4 py-3',
                            date.available
                                ? date.disabled
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-blue-600 text-white'
                                : 'bg-gray-400 text-gray-800'
                        )}>
                        <span className={clsx('text-sm font-medium', date.available && !date.disabled && 'text-white')}>
                            {date.day}
                        </span>
                        <span
                            className={clsx(
                                'text-xs font-semibold',
                                date.available && !date.disabled ? 'text-white' : 'text-gray-800'
                            )}>
                            {date.name}
                        </span>
                        {/* {!date.available && <span className='text-xs text-red-600'>Unavailable</span>}
                        {date.available && date.disabled && <span className='text-xs text-yellow-600'>No Menu</span>} */}
                    </div>
                ))}
            </div>
            {/* <div className='flex flex-col gap-2'>
                {dailyMenus?.meals.map(meal => <MealCard key={meal.name} {...meal} isOrdered={false} />)}
            </div> */}
        </div>
    )
}
