import { DailyMenuMeal, useReadDailyMenus } from '@/api/daily-menus'
import { useAddIncrementOrderItemQuantity } from '@/api/order'
import { Loader } from '@/components'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { useState } from 'react'
import { useCartStore } from '../../../../../state'
import MealDrawerCard from './MealDrawerCard'

interface OrderDialogSideDishDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export const OrderDialogSideDishDrawer = ({ isOpen, onClose }: OrderDialogSideDishDrawerProps) => {
    const path = usePathParams<CompanyPath>()
    const { addToCart, selectedDate, selectedShift, setActiveOrderId, activeOrderId } = useCartStore()
    const { mutate } = useAddIncrementOrderItemQuantity()
    const [selectedMeal, setSelectedMeal] = useState<DailyMenuMeal | null>(null)
    const { data: dailyMenus, isLoading } = useReadDailyMenus({
        query: {
            filter: {
                from: selectedDate,
                to: selectedDate
            }
        }
    })

    if (isLoading) return <Loader />

    const mainCourseMeals = dailyMenus?.flatMap(menu => menu.meals.filter(meal => meal.type === 'SideDish')) || []

    const handleMealClick = (meal: DailyMenuMeal) => {
        setSelectedMeal(meal)
        mutate(
            {
                path: {
                    ...path,
                    orderId: activeOrderId,
                    skuId: meal.id
                }
            },
            {
                onSuccess: () => {
                    addToCart({
                        id: meal.id,
                        name: meal.name,
                        price: meal.price,
                        quantity: 1, // Assuming quantity is always 1 when adding directly
                        imageUrl: meal.imageUrl,
                        type: 'SideDish'
                    })
                    onClose()
                }
            }
        )
    }

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='text-left'>
                        <DrawerTitle className='mt-2 text-3xl font-bold lowercase'>Preporuke</DrawerTitle>
                    </DrawerHeader>

                    <div className='px-2 py-4'>
                        <div className='flex space-x-4 overflow-x-scroll pb-4'>
                            {mainCourseMeals.map(meal => (
                                <MealDrawerCard key={meal.id} meal={meal} onClick={() => handleMealClick(meal)} />
                            ))}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
