import { DailyMenuMeal, ReadDailyMenuResponse } from '@/api/daily-menus'
import { readDailyMenus, useReadDailyMenus } from '@/api/daily-menus/repository/hooks/readDailyMenus'
import { useReadShifts } from '@/api/shifts'
import { Loader } from '@/components'
import { useAppDate } from '@/hooks'
import { DateIso } from '@/types'
import { useEffect, useState } from 'react'
import { useCartStore } from '../../state'
import { calculateDateRange, generateUpcomingDates, UpcomingDailyMenuDate } from '../../utils'
import DaySelectorNav from './components/DaySelectorNav/DaySelectorNav'
import MealCard from './components/MealCard/MealCard'
import { ShiftSelectorNav } from './components/ShiftSelectorNav/ShiftSelectorNav'
import ShoppingCart from './components/ShoppingCart/ShoppingCart'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { toDateIso } from '@/utils/date'

// Calculate the first and last day of the month based on the selected month
const getFirstAndLastDayOfMonth = (date: Date) => {
    const firstDay = toDateIso(new Date(date.getFullYear(), date.getMonth(), 1))
    const lastDay = toDateIso(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    return { firstDay, lastDay }
}

export const CompanyOrderForm = () => {
    const { getAppDate } = useAppDate()
    const today = getAppDate()
    const { from, to } = calculateDateRange(today)
    const { addToCart } = useCartStore()
    const [dailyMenus, setDailyMenus] = useState<ReadDailyMenuResponse[]>([])
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const { data: shifts } = useReadShifts()
    const [dates, setDates] = useState<UpcomingDailyMenuDate[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<DateIso>('')
    const [activeShiftId, setActiveShiftId] = useState<string>('')
    const [selectedMeals, setSelectedMeals] = useState<DailyMenuMeal[]>([])
    const [orderedMeals, setOrderedMeals] = useState<DailyMenuMeal[]>([])

    const initialFetch = async () => {
        const { firstDay, lastDay } = getFirstAndLastDayOfMonth(currentMonth)
        const dailyMenusResult = await readDailyMenus({ path: '', query: { pagination: {...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST}, filter: {from: firstDay, to: lastDay}}})
        setDailyMenus(dailyMenusResult)
    }

    useEffect(() => {
        setIsLoading(true)
        initialFetch()
        .finally(() => setIsLoading(false))
    }, [currentMonth])

    useEffect(() => {
        const upcomingDates = generateUpcomingDates(today, dailyMenus)
        setDates(upcomingDates)
        if (upcomingDates.length > 0) {
            setSelectedDate(upcomingDates[0].date)
        }
    }, [dailyMenus, today])

    useEffect(() => {
        if (selectedDate) {
            const selectedMeals = dailyMenus?.find(({ date }) => date === selectedDate)?.meals || []
            setSelectedMeals(selectedMeals)
        }
    }, [selectedDate, dailyMenus])

    useEffect(() => {
        if (!shifts?.length) return

        setActiveShiftId(shifts[0].id)
    }, [shifts])

    const handleOrderMeal = (meal: DailyMenuMeal) => {
        addToCart(activeShiftId, selectedDate, { ...meal, quantity: 1 })
        setOrderedMeals(prev => [...prev, meal]) // Update ordered meals state
    }

    if (isLoading) return <Loader />

    return (
        <>
            <ShiftSelectorNav activeShiftId={activeShiftId} onShiftSelect={setActiveShiftId} />
            <div className='mt-4 flex h-full justify-between'>
                <div className='flex flex-col'>
                    <ShoppingCart selectedDate={selectedDate} shiftId={activeShiftId} />
                    <DaySelectorNav dates={dates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                </div>
                <div className='mt-4 flex flex-col items-center gap-2'>
                    {selectedMeals.map(meal => (
                        <MealCard
                            key={meal.name}
                            {...meal}
                            isOrdered={orderedMeals.includes(meal)} // Pass ordered state to MealCard
                            onOrder={() => handleOrderMeal(meal)}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
