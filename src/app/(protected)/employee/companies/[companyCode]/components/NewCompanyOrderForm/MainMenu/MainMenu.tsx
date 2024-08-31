import React, { useEffect, useState } from 'react';
import { OrderDetails, useCartStore } from '@/app/(protected)/employee/newstate';
import { MealCard } from '../../CompanyOrderForm/components/MealCard/MealCard';
import { OrderDialogButton } from '../../CompanyOrderForm/components/OrderDialogButton/OrderDialogButton';
import DaySelectorNav from '../DaySelector/DaySelector';
import { ShiftSelectorNav } from '../ShiftSelector/ShiftSelector';
import MealTypeSelectorNav from '../MealTypeSelector/MealTypeSelector';
import { MealDrawer } from '../MealDrawer/MealDrawer';

const MainMenu: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
    const [selectedMealType, setSelectedMealType] = useState<'MainCourse' | 'SideDish'>('MainCourse');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const setActiveDay = useCartStore(state => state.setActiveDay);
    const setActiveShift = useCartStore(state => state.setActiveShift);
    const fetchMenus = useCartStore(state => state.fetchMenus);
    const fetchImmediateOrders = useCartStore(state => state.fetchImmediateOrders);
    const fetchScheduledOrders = useCartStore(state => state.fetchScheduledOrders);
    
    const activeMenus = useCartStore(state => state.activeMenus);
    const activeALaCarteMenus = useCartStore(state => state.activeALaCarteMenus);
    const regularShifts = useCartStore(state => state.regularShifts);
    const aLaCarteShift = useCartStore(state => state.aLaCarteShift);
    const activeShift = useCartStore(state => state.activeShift);
    const immediateOrders = useCartStore(state => state.immediateOrders);
    const scheduledOrders = useCartStore(state => state.scheduledOrders);

    const [activeOrder, setActiveOrder] = useState<OrderDetails | undefined>(undefined);

    useEffect(() => {
        const dateIso = selectedDay === 'today' ? new Date().toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0];
        setActiveDay(dateIso);
        fetchMenus(dateIso);
        fetchImmediateOrders(dateIso);
        fetchScheduledOrders(dateIso);
        setActiveShift(undefined); // Reset selected shift when day changes
    }, [selectedDay]);

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

    const handleMealClick = (meal) => {
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
            <DaySelectorNav selectedDay={selectedDay} onDayChange={handleDayChange} />

            {/* Shift Selector */}
            <ShiftSelectorNav
                selectedShiftId={activeShift?.id}
                onShiftChange={handleShiftChange}
                shifts={regularShifts}
                aLaCarteShift={aLaCarteShift}
            />

            {/* Meal Type Selector */}
            <MealTypeSelectorNav selectedMealType={selectedMealType} onMealTypeChange={handleMealTypeChange} />

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
