import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/app/(protected)/employee/newstate';
import { MealCard } from '../../CompanyOrderForm/components/MealCard/MealCard';
import DaySelector from '../DaySelector/DaySelector';
import { ShiftSelector } from '../ShiftSelector/ShiftSelector';
import MealTypeSelector from '../MealTypeSelector/MealTypeSelector';
import { MealDrawer } from '../MealDrawer/MealDrawer';
import { DailyMenuMeal } from '@/api/daily-menus';
import { DateIso } from '@/types';
import Cart from '../Cart/Cart';

const MainMenu: React.FC = () => {
    const [selectedMealType, setSelectedMealType] = useState<'MainCourse' | 'SideDish'>('MainCourse');
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {
        setActiveDay,
        setActiveShift,
        fetchMenus,
        fetchImmediateOrders,
        fetchScheduledOrders,
        activeMenus,
        activeALaCarteMenus,
        regularShifts,
        aLaCarteShift,
        activeShift,
        hasALaCardPermission,
        activeDay,
        selectedOrder,
    } = useCartStore();

    useEffect(() => {
        const defaultDay = hasALaCardPermission
            ? new Date().toISOString().split('T')[0]
            : new Date(Date.now() + 86400000).toISOString().split('T')[0];

        setActiveDay(defaultDay as DateIso);
        fetchMenus(defaultDay as DateIso);
        fetchImmediateOrders(defaultDay as DateIso);
        fetchScheduledOrders(defaultDay as DateIso);
        setActiveShift(undefined); // Reset selected shift when day changes
    }, [hasALaCardPermission, setActiveDay, setActiveShift, fetchMenus, fetchImmediateOrders, fetchScheduledOrders]);

    const handleShiftChange = (shiftId: string) => {
        setActiveShift(shiftId);
    };

    const handleMealTypeChange = (mealType: 'MainCourse' | 'SideDish') => {
        setSelectedMealType(mealType);
    };

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedMeal(null);
    };

    const alacardMeals = activeShift?.id === aLaCarteShift?.id && activeALaCarteMenus ? activeALaCarteMenus[0].meals : [];
    const regularMeals = activeMenus ? activeMenus[0].meals : [];

    const mealsToDisplay = (activeShift?.id === aLaCarteShift?.id && activeALaCarteMenus ? alacardMeals : regularMeals)
        ?.filter(meal => meal.type === selectedMealType) || [];

    const mealsInActiveOrder = selectedOrder?.orderItems.filter(meal => meal.type === selectedMealType) || [];

    const isTodaySelected = activeDay === new Date().toISOString().split('T')[0] as DateIso;

    return (
        <div className="relative p-4">
            {/* Day Selector */}
            {hasALaCardPermission && (
                <DaySelector />
            )}

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
            <div className="grid grid-cols-1 gap-6 mt-4">
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
            {selectedMeal && (
                <MealDrawer meal={selectedMeal} isOpen={isDrawerOpen} onClose={closeDrawer} />
            )}

            {/* Cart */}
            <Cart />
        </div>
    );
};

export default MainMenu;