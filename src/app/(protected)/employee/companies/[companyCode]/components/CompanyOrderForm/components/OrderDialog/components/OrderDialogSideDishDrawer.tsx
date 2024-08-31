import { DailyMenuMeal, useReadDailyMenus } from '@/api/daily-menus'
import { useAddIncrementOrderItemQuantity } from '@/api/order'
import { Loader } from '@/components'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { useCartStore } from '../../../../../state'
import MealDrawerCard from './MealDrawerCard'

interface OrderDialogSideDishDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export const OrderDialogSideDishDrawer = ({ isOpen, onClose }: OrderDialogSideDishDrawerProps) => {
    const path = usePathParams<CompanyPath>()
    const { addToCart, activeDate, activeOrderId } = useCartStore()
    const { mutate } = useAddIncrementOrderItemQuantity()
    const { data: dailyMenus, isLoading } = useReadDailyMenus({
        query: {
            filter: {
                from: activeDate,
                to: activeDate
            }
        }
    })

    if (isLoading) return <Loader />

    const mainCourseMeals = dailyMenus?.flatMap(menu => menu.meals.filter(meal => meal.type === 'SideDish')) || []

    const handleMealClick = (meal: DailyMenuMeal) => {
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
                        quantity: 1,
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
