import React, { useEffect, useState } from 'react';
import { OrderDetails, useCartStore } from '@/app/(protected)/employee/newstate';
import { MealCard } from '../../CompanyOrderForm/components/MealCard/MealCard';
import { OrderDialogButton } from '../../CompanyOrderForm/components/OrderDialogButton/OrderDialogButton';
import DaySelector from '../DaySelector/DaySelector';
import { ShiftSelector } from '../ShiftSelector/ShiftSelector';
import MealTypeSelector from '../MealTypeSelector/MealTypeSelector';
import { MealDrawer } from '../MealDrawer/MealDrawer';
import { DailyMenuMeal } from '@/api/daily-menus';

const MainMenu: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
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
        immediateOrders,
        scheduledOrders,
        hasALaCardPermission,
        activeDay,
    } = useCartStore();

    const [activeOrder, setActiveOrder] = useState<OrderDetails | undefined>(undefined);

    useEffect(() => {
        const defaultDay = hasALaCardPermission
            ? new Date().toISOString().split('T')[0]
            : new Date(Date.now() + 86400000).toISOString().split('T')[0];

        setSelectedDay(hasALaCardPermission ? 'today' : 'tomorrow');
        setActiveDay(defaultDay);
        fetchMenus(defaultDay);
        fetchImmediateOrders(defaultDay);
        fetchScheduledOrders(defaultDay);
        setActiveShift(undefined); // Reset selected shift when day changes
    }, [hasALaCardPermission]);

    useEffect(() => {
        if (activeShift) {
            const relevantOrders = [...immediateOrders, ...scheduledOrders];
            const foundOrder = relevantOrders.find(order => order.orderedForShiftId === activeShift.id);
            setActiveOrder(foundOrder);
        }
    }, [activeShift, immediateOrders, scheduledOrders]);

    const handleDayChange = (day: 'today' | 'tomorrow') => {
        setSelectedDay(day);
    };

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

    const mealsInActiveOrder = activeOrder?.orderItems.filter(meal => meal.type === selectedMealType) || [];

    return (
        <div className="p-4">
            {/* Day Selector */}
            {hasALaCardPermission && (
                <DaySelector />
            )}

            {/* Shift Selector */}
            <ShiftSelector
                selectedShiftId={activeShift?.id}
                onShiftChange={handleShiftChange}
                shifts={regularShifts}
                aLaCarteShift={hasALaCardPermission ? aLaCarteShift : undefined}
                hasALaCardPermission={hasALaCardPermission}
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

            {/* Order Button */}
            <OrderDialogButton />

            {/* Meal Drawer */}
            {selectedMeal && (
                <MealDrawer meal={selectedMeal} isOpen={isDrawerOpen} onClose={closeDrawer} />
            )}
        </div>
    );
};

export default MainMenu;
