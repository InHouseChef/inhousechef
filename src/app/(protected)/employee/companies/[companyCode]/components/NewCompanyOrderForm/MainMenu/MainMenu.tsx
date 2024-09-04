import { DailyMenuMeal } from '@/api/daily-menus'
import { useCartStore } from '@/app/(protected)/employee/newstate'
import { DateLocalIso } from '@/types'
import { getToLocalISOString } from '@/utils/date'
import React, { useEffect, useState } from 'react'
import Cart from '../Cart/Cart'
import DaySelector from '../DaySelector/DaySelector'
import { MealCard } from '../MealCard/MealCard'
import { MealDrawer } from '../MealDrawer/MealDrawer'
import MealTypeSelector from '../MealTypeSelector/MealTypeSelector'
import { ShiftSelector } from '../ShiftSelector/ShiftSelector'

const MainMenu: React.FC = () => {
    const [selectedMealType, setSelectedMealType] = useState<'MainCourse' | 'SideDish'>('MainCourse')
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | undefined>(undefined)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const {
        setActiveShift,
        activeMenus,
        activeALaCarteMenus,
        regularShifts,
        aLaCarteShift,
        activeShift,
        hasALaCardPermission,
        activeDay,
        selectedOrder,
        shouldDisableOrder
    } = useCartStore()

    const isOrderDisabled = shouldDisableOrder(selectedOrder);

    const handleShiftChange = (shiftId: string) => {
        setActiveShift(shiftId)
    }

    const handleMealTypeChange = (mealType: 'MainCourse' | 'SideDish') => {
        setSelectedMealType(mealType)
    }

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal)
        setIsDrawerOpen(true)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
        setSelectedMeal(undefined)
    }

    const alacardMeals = activeShift?.id === aLaCarteShift?.id && activeALaCarteMenus ? activeALaCarteMenus[0]?.meals : []
    const regularMeals = activeMenus ? activeMenus[0].meals : []

    const mealsToDisplay =
        (activeShift?.id === aLaCarteShift?.id && activeALaCarteMenus ? alacardMeals : regularMeals)?.filter(
            meal => meal.type === selectedMealType
        ) || []

    const mealsInActiveOrder = !isOrderDisabled && selectedOrder?.orderItems.filter(meal => meal.type === selectedMealType) || []

    const isTodaySelected = activeDay === (getToLocalISOString(new Date()).split('T')[0] as DateLocalIso)

    return (
        <div className='relative px-4 pb-4'>

            {/* Shift Selector */}
            <ShiftSelector
                selectedShiftId={activeShift?.id}
                onShiftChange={handleShiftChange}
                shifts={regularShifts}
                aLaCarteShift={aLaCarteShift}
                isTodaySelected={isTodaySelected}
            />

            {/* Meal Type Selector */}
            <MealTypeSelector selectedMealType={selectedMealType} onMealTypeChange={handleMealTypeChange} />

            {/* Meal List */}
            <div className='mt-4 grid grid-cols-1 gap-6'>
                {mealsToDisplay.map(meal => (
                    <MealCard
                        key={meal.id}
                        {...meal}
                        quantity={mealsInActiveOrder.find(orderItem => orderItem.skuId === meal.id)?.quantity}
                        onClick={() => handleMealClick(meal)}
                    />
                ))}
            </div>

            {/* Meal Drawer */}
            <MealDrawer meal={selectedMeal} isOpen={isDrawerOpen} onClose={closeDrawer} />

            {/* Cart */}
            <Cart />
        </div>
    )
}

export default MainMenu
