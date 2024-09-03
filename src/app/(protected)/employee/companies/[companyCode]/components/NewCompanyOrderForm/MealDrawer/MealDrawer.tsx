import { DailyMenuMeal } from '@/api/daily-menus'
import { useCartStore } from '@/app/(protected)/employee/newstate'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useEffect, useState } from 'react'

interface MealDrawerProps {
    meal: DailyMenuMeal | null
    isOpen: boolean
    onClose: () => void
}

export const MealDrawer = ({ meal, isOpen, onClose }: MealDrawerProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { addOrUpdateOrder } = useCartStore()
    const [quantity, setQuantity] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(isOpen)

    useEffect(() => {
        if (isOpen) {
            setDrawerOpen(true)
        }
    }, [isOpen])

    const handleAddToOrder = async () => {
        if (!meal) {
            return
        }
        setIsLoading(true)
        await addOrUpdateOrder(meal.id, quantity)
        setIsLoading(false)
        handleCloseDrawer()
    }

    const handleQuantityChange = (increment: number) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + increment))
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setTimeout(() => {
            onClose()
        }, 300) // Delay closing to allow the drawer to animate
    }

    if (!meal) {
        return null
    }

    return (
        <Drawer open={drawerOpen} onClose={handleCloseDrawer}>
            <DrawerContent onPointerDownOutside={e => e.target === e.currentTarget && handleCloseDrawer()}>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='text-left'>
                        {meal.imageUrl ? (
                            <img src={meal.imageUrl} alt={meal.name} className='h-64 w-full rounded-lg object-cover' />
                        ) : (
                            <div className='flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gray-200 text-gray-600'>
                                Nema slike
                            </div>
                        )}
                        <DrawerTitle className='mt-2 text-3xl font-bold lowercase'>{meal.name}</DrawerTitle>
                        <p className='font-semibold text-blue-500'>{meal.price.toFixed(2)} RSD</p>
                        {meal.description ? <p className='mt-4 text-sm text-gray-600'>{meal.description}</p> : undefined}
                    </DrawerHeader>

                    <DrawerFooter className='items-center justify-between'>
                        <div className='flex items-center justify-between gap-2'>
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
                        <Button
                            type='button'
                            onClick={handleAddToOrder}
                            loading={isLoading}
                            className='flex min-w-full items-center justify-between gap-2'>
                            <span>Dodaj u porudžbinu</span>
                            <span className='font-semibold'>{(meal.price * quantity).toFixed(2)} RSD</span>
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
