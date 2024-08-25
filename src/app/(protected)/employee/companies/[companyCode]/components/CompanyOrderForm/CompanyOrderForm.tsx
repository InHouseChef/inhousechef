import { DailyMenuMeal, ReadDailyMenuResponse } from '@/api/daily-menus'
import { readDailyMenus } from '@/api/daily-menus/repository/hooks/readDailyMenus'
import { useReadShifts } from '@/api/shifts'
import { Loader } from '@/components'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { useAppDate } from '@/hooks'
import { toDateIso } from '@/utils/date'
import { useEffect, useState } from 'react'
import { useCartStore } from '../../state'
import DaySelectorNav from './components/DaySelectorNav/DaySelectorNav'
import { MealCard } from './components/MealCard/MealCard'
import { MealDrawer } from './components/MealDrawer/MealDrawer'
import { OrderDialogButton } from './components/OrderDialogButton/OrderDialogButton'
import { ShiftSelectorNav } from './components/ShiftSelectorNav/ShiftSelectorNav'

const getFirstAndLastDayOfMonth = (date: Date) => {
    const firstDay = toDateIso(new Date(date.getFullYear(), date.getMonth(), 1))
    const lastDay = toDateIso(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    return { firstDay, lastDay }
}

export const CompanyOrderForm = () => {
    const { selectedDate, setSelectedDate, selectedShiftId, setSelectedShift } = useCartStore()
    const { getAppDate } = useAppDate()
    const today = getAppDate()
    const [dailyMenus, setDailyMenus] = useState<ReadDailyMenuResponse[]>([])
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const { data: shifts } = useReadShifts()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [meals, setMeals] = useState<DailyMenuMeal[]>([])

    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

    const initialFetch = async () => {
        const { firstDay, lastDay } = getFirstAndLastDayOfMonth(currentMonth)
        const dailyMenusResult = await readDailyMenus({
            path: '',
            query: {
                pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST },
                filter: { from: firstDay, to: lastDay }
            }
        })
        setDailyMenus(dailyMenusResult)
    }

    useEffect(() => {
        if (!selectedDate) return setSelectedDate(today)
        setSelectedDate(selectedDate)
    }, [selectedDate])

    useEffect(() => {
        if (!selectedShiftId && shifts) return setSelectedShift(shifts[0]?.id)
        setSelectedShift(selectedShiftId)
    }, [selectedShiftId, shifts])

    useEffect(() => {
        if (selectedDate) {
            const meals = dailyMenus?.find(({ date }) => date === selectedDate)?.meals || []
            setMeals(meals)
        }
    }, [selectedDate, dailyMenus])

    useEffect(() => {
        setIsLoading(true)
        initialFetch().finally(() => setIsLoading(false))
    }, [currentMonth])

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal)
        setIsDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false)
    }

    if (isLoading) return <Loader />

    return (
        <>
            <div className='mt-4'></div>
            <DaySelectorNav />
            <div className='mt-4'></div>
            <ShiftSelectorNav />
            <div className='relative'>
                <div className='mx-4 mt-4 grid grid-cols-1 gap-5'>
                    {meals.map(meal => (
                        <MealCard key={meal.id} {...meal} onClick={() => handleMealClick(meal)} />
                    ))}
                </div>
                <OrderDialogButton />
            </div>
            {selectedMeal ? <MealDrawer meal={selectedMeal} isOpen={isDrawerOpen} onClose={handleCloseDrawer} /> : undefined}
        </>
    )
}
