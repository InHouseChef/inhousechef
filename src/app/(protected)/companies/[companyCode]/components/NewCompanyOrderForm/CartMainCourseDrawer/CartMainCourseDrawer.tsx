import { DailyMenuMeal } from '@/api/daily-menus'
import { useCartStore } from '@/app/(protected)/newstate'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useState } from 'react'
import MealDrawerCard from '../MealDrawerCard/MealDrawerCard'

interface CartMainCourseDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export const CartMainCourseDrawer = ({ isOpen, onClose }: CartMainCourseDrawerProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { activeMenus, addOrUpdateOrder } = useCartStore()
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null)
    const [quantity, setQuantity] = useState(1)

    const mainCourseMeals = activeMenus?.flatMap(menu => menu.meals.filter(meal => meal.type === 'MainCourse')) || []

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal)
        setQuantity(1) // Reset quantity when a new meal is selected
    }

    const handleAddToOrder = async () => {
        if (selectedMeal) {
            setIsLoading(true)
            await addOrUpdateOrder(selectedMeal.id, quantity)
            setIsLoading(false)
            setSelectedMeal(null)
            setQuantity(1)
            onClose()
        }
    }

    const handleQuantityChange = (increment: number) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + increment))
    }

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent onPointerDownOutside={e => e.target === e.currentTarget && onClose()}>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='text-left'>
                        <DrawerTitle className='mt-2 text-3xl font-bold lowercase text-gray-700'>Glavna jela</DrawerTitle>
                    </DrawerHeader>

                    <div className='px-2 py-4'>
                        <div className='flex space-x-4 overflow-x-auto pb-4'>
                            {mainCourseMeals.map(meal => (
                                <MealDrawerCard key={meal.id} meal={meal} onClick={() => handleMealClick(meal)} />
                            ))}
                        </div>
                    </div>

                    {selectedMeal && (
                        <DrawerFooter className='items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}>
                                    -
                                </Button>
                                <div className='text-lg font-semibold'>{quantity}</div>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => handleQuantityChange(1)}>
                                    +
                                </Button>
                            </div>
                            <Button type='button' onClick={handleAddToOrder} loading={isLoading} className='flex items-center space-x-2'>
                                <span>Dodaj u porudžbinu</span>
                                <span className='font-semibold'>{(selectedMeal.price * quantity).toFixed(2)} RSD</span>
                            </Button>
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
