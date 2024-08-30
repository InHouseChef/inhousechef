import { ALaCardMenuMeal, useReadALaCardMenus } from '@/api/alacard-menus'
import { DailyMenuMeal, ReadDailyMenuResponse } from '@/api/daily-menus'
import { readDailyMenus } from '@/api/daily-menus/repository/hooks/readDailyMenus'
import { useReadMyOrder } from '@/api/order'
import { useReadShifts } from '@/api/shifts'
import { useReadMyUser } from '@/api/users'
import { Loader } from '@/components'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { useAppDate } from '@/hooks'
import { getTomorrowDateIso, toDateFromDateIso, toDateIso } from '@/utils/date'
import { useEffect, useState } from 'react'
import { useCartStore } from '../../state'
import DaySelectorNav from './components/DaySelectorNav/DaySelectorNav'
import { MealCard } from './components/MealCard/MealCard'
import { MealDrawer } from './components/MealDrawer/MealDrawer'
import MealTypeSelectorNav from './components/MealTypeSelectorNav/MealTypeSelectorNav'
import { OrderDialogButton } from './components/OrderDialogButton/OrderDialogButton'
import { ShiftSelectorNav } from './components/ShiftSelectorNav/ShiftSelectorNav'

const getFirstAndLastDayOfMonth = (date: Date) => {
    const firstDay = toDateIso(new Date(date.getFullYear(), date.getMonth(), 1))
    const lastDay = toDateIso(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    return { firstDay, lastDay }
}

export const CompanyOrderForm = () => {
    const cart = useCartStore()
    const {
        selectedDate,
        setSelectedDate,
        setSelectedShift,
        addToCart,
        resetCart,
        setActiveOrderId,
        selectedMealType,
        selectedShift,
        aLaCardShift
    } = cart
    const { getAppDate, getAppDateTime } = useAppDate()
    const today = getAppDate()
    const tomorrow = getTomorrowDateIso(toDateFromDateIso(today))
    const [dailyMenus, setDailyMenus] = useState<ReadDailyMenuResponse[]>([])
    const { data: myUser, isLoading: isLoadingMyUser } = useReadMyUser()
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [meals, setMeals] = useState<DailyMenuMeal[]>([])
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [filteredMeals, setFilteredMeals] = useState<DailyMenuMeal[]>([])
    const [shiftsAvailable, setShiftsAvailable] = useState<boolean>(true)
    const [aLaCardMeals, setALaCardMeals] = useState<ALaCardMenuMeal[]>([])

    const { data: shifts } = useReadShifts()
    const { data: myOrder, isLoading: isLoadingMyOrder } = useReadMyOrder({
        query: {
            filter: {
                fromDate: today,
                toDate: tomorrow
            }
        }
    })

    const { data: aLaCardMenus, isLoading: isLoadingALaCardMenus } = useReadALaCardMenus({
        query: {
            filter: {
                from: today,
                to: tomorrow
            }
        }
    })

    // TODO: check reset
    // useEffect(() => {
    //     if (!myOrder || myOrder.length === 0) return

    //     myOrder.forEach(order => {
    //         const { id, orderDate, orderedForShiftId, orderItems } = order
    //         const orderShift = shifts?.find(({ id }) => id === orderedForShiftId)

    //         resetCart()
    //         setActiveOrderId(id)
    //         setSelectedShift(orderShift)
    //         setSelectedDate(orderDate)
    //         orderItems.forEach(({ skuId, name, quantity, price, imageUrl, type }) => {
    //             addToCart({
    //                 id: skuId,
    //                 name: name,
    //                 quantity: quantity,
    //                 price: price,
    //                 imageUrl: imageUrl,
    //                 type: type
    //             })
    //         })
    //     })
    // }, [myOrder])

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
        if (!selectedDate) return
        const meals = dailyMenus?.find(({ date }) => date === selectedDate)?.meals || []
        setMeals(meals)
    }, [selectedDate, dailyMenus])

    useEffect(() => {
        setIsLoading(true)
        initialFetch().finally(() => setIsLoading(false))
    }, [currentMonth])

    useEffect(() => {
        const filtered = meals.filter(({ type }) => type === selectedMealType)
        setFilteredMeals(filtered)
    }, [selectedMealType, meals])

    useEffect(() => {
        if (selectedShift?.id === aLaCardShift?.id) {
            const aLaCardMeals = aLaCardMenus?.find(({ date }) => date === selectedDate)?.meals || []
            setALaCardMeals(aLaCardMeals)
        }
    }, [selectedShift, selectedDate, aLaCardShift])

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal)
        setIsDrawerOpen(true)
    }

    const handleCloseDrawer = () => setIsDrawerOpen(false)

    if (isLoading || isLoadingMyOrder || isLoadingMyUser || isLoadingALaCardMenus) return <Loader />

    return (
        <>
            <div className='mt-4'></div>
            <DaySelectorNav />
            <div>
                {/* TODO: check out overlay */}
                {/* {!shiftsAvailable && (
                    <Overlay
                        message='
                Nema dostupnih smena za poručivanje. Molimo pokušajte kasnije.
            '
                    />
                )} */}
                <div className='mt-4'></div>
                <ShiftSelectorNav />
                <div className='mt-2'></div>
                <MealTypeSelectorNav />
                <div className='relative'>
                    <div className='mx-4 mt-4 grid grid-cols-1 gap-6'>
                        {filteredMeals.map(meal => (
                            <MealCard key={meal.id} {...meal} onClick={() => handleMealClick(meal)} />
                        ))}
                    </div>
                    {selectedShift?.id === aLaCardShift?.id && (
                        <div className='mx-4 mt-4 grid grid-cols-1 gap-6'>
                            {aLaCardMeals.map(meal => (
                                <MealCard key={meal.id} {...meal} onClick={() => handleMealClick(meal)} />
                            ))}
                        </div>
                    )}
                    <OrderDialogButton />
                </div>
                {selectedMeal ? (
                    <MealDrawer meal={selectedMeal} isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
                ) : undefined}
            </div>
        </>
    )
}
