import { DailyMenuMeal, ReadDailyMenuResponse } from '@/api/daily-menus'
import { readDailyMenus } from '@/api/daily-menus/repository/hooks/readDailyMenus'
import { useReadMyOrder } from '@/api/order'
import { useReadShifts } from '@/api/shifts'
import { Loader } from '@/components'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { useAppDate } from '@/hooks'
import { getTomorrowDateIso, toDateFromDateIso, toDateIso } from '@/utils/date'
import { useEffect, useState } from 'react'
import { useCartStore } from '../../state'
import { canScheduleOrder, sortShiftsByStartAt } from '../../utils'
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
    const cart = useCartStore()
    const { selectedDate, setSelectedDate, selectedShiftId, setSelectedShift, addToCart, resetCart, setActiveOrderId } = cart
    const { getAppDate } = useAppDate()
    const today = getAppDate()
    const tomorrow = getTomorrowDateIso(toDateFromDateIso(today))
    const [dailyMenus, setDailyMenus] = useState<ReadDailyMenuResponse[]>([])
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [meals, setMeals] = useState<DailyMenuMeal[]>([])
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

    const { data: shifts } = useReadShifts()
    const { data: myOrder, isLoading: isLoadingMyOrder } = useReadMyOrder({
        query: {
            filter: {
                fromDate: today,
                toDate: tomorrow
            }
        }
    })

    // TODO: check reset
    useEffect(() => {
        if (!myOrder || myOrder.length === 0) return

        console.log(cart)
        myOrder.forEach(order => {
            const { id, orderDate, orderedForShiftId, orderItems } = order
            console.log(order)

            resetCart()
            setActiveOrderId(id)
            setSelectedShift(orderedForShiftId)
            setSelectedDate(orderDate)
            orderItems.forEach(({ skuId, name, quantity, price }) => {
                addToCart({
                    id: skuId,
                    name: name,
                    quantity: quantity,
                    price: price,
                    imageUrl: '' // Assuming imageUrl is not available in orderItems
                })
            })
        })
    }, [myOrder])

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
        if (!shifts) return

        const sortedShifts = sortShiftsByStartAt(shifts)

        const earliestAvailableShift = sortedShifts?.find(shift => canScheduleOrder(shift, toDateFromDateIso(today)))

        if (!selectedShiftId && earliestAvailableShift) {
            setSelectedShift(earliestAvailableShift.id)
        }
    }, [selectedShiftId, shifts, today, setSelectedShift])

    useEffect(() => {
        if (!selectedDate) return

        const meals = dailyMenus?.find(({ date }) => date === selectedDate)?.meals || []
        setMeals(meals)
    }, [selectedDate, dailyMenus])

    useEffect(() => {
        setIsLoading(true)
        initialFetch().finally(() => setIsLoading(false))
    }, [currentMonth])

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal)
        setIsDrawerOpen(true)
    }

    const handleCloseDrawer = () => setIsDrawerOpen(false)

    if (isLoading || isLoadingMyOrder) return <Loader />

    // TODO: add meal categories

    return (
        <>
            <div className='mt-4'></div>
            <DaySelectorNav />
            <div className='mt-4'></div>
            <ShiftSelectorNav />
            <div className='relative'>
                <div className='mx-4 mt-4 grid grid-cols-1 gap-6'>
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
