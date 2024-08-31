import { DailyMenuMeal } from '@/api/daily-menus';
import { useCartStore } from '@/app/(protected)/employee/newstate';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useState } from 'react';

interface MealDrawerProps {
    meal: DailyMenuMeal;
    isOpen: boolean;
    onClose: () => void;
}

export const MealDrawer = ({ meal, isOpen, onClose }: MealDrawerProps) => {
    const { addOrUpdateOrder } = useCartStore();
    const [quantity, setQuantity] = useState(1);

    const handleAddToOrder = () => {
        addOrUpdateOrder(meal.id, quantity);
        onClose();
    };

    const handleQuantityChange = (increment: number) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + increment));
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left">
                        {meal.imageUrl ? (
                            <img src={meal.imageUrl} alt={meal.name} className="h-64 w-full rounded-lg object-cover" />
                        ) : (
                            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                                No Image
                            </div>
                        )}
                        <DrawerTitle className="mt-2 text-3xl font-bold lowercase">{meal.name}</DrawerTitle>
                        <p className="font-semibold text-blue-500">{meal.price.toFixed(2)} RSD</p>
                        {meal.description ? <p className="mt-4 text-sm text-gray-600">{meal.description}</p> : undefined}
                    </DrawerHeader>

                    <DrawerFooter className="items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </Button>
                            <div className="text-lg font-semibold">{quantity}</div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleQuantityChange(1)}
                            >
                                +
                            </Button>
                        </div>
                        <Button type="button" onClick={handleAddToOrder} className="flex items-center space-x-2">
                            <span>Dodaj u porudžbinu</span>
                            <span className="font-semibold">{(meal.price * quantity).toFixed(2)} RSD</span>
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
