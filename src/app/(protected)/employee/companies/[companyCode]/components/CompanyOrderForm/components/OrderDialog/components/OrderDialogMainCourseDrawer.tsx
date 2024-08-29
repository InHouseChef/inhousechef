import { DailyMenuMeal, useReadDailyMenus } from '@/api/daily-menus'
import { useAddIncrementOrderItemQuantity } from '@/api/order'
import { Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { useState } from 'react'
import { useCartStore } from '../../../../../state'

interface MealCardDrawerProps {
    meal?: DailyMenuMeal
    onClick: () => void
}

const MealCardDrawer = ({ meal, onClick }: MealCardDrawerProps) => (
    <div
        className='w-60 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-4 shadow-md'
        key={meal?.id}
        onClick={onClick}>
        <img src={meal?.imageUrl} alt={meal?.name} className='h-32 w-full object-cover' />
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-0'>
                <h3 className='text-lg font-semibold'>{meal?.name}</h3>
                <p className='text-gray-500'>{meal?.price.toFixed(2)} RSD</p>
            </div>
            <Button onClick={onClick} className='self-start'>
                Izaberi
            </Button>
        </div>
    </div>
)

export default MealCardDrawer

interface OrderDialogMainCourseDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export const OrderDialogMainCourseDrawer = ({ isOpen, onClose }: OrderDialogMainCourseDrawerProps) => {
    const path = usePathParams<CompanyPath>()
    const { addToCart, selectedDate, selectedShiftId, setActiveOrderId, activeOrderId } = useCartStore()
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

    const mainCourseMeals = dailyMenus?.flatMap(menu => menu.meals.filter(meal => meal.type === 'MainCourse')) || []

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
                        type: 'MainCourse'
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
                                <MealCardDrawer key={meal.id} meal={meal} onClick={() => handleMealClick(meal)} />
                            ))}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
