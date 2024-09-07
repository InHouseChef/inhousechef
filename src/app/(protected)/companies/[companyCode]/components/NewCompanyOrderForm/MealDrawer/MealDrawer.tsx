import { DailyMenuMeal } from '@/api/daily-menus'
import { useCartStore } from '@/app/(protected)/newstate'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useEffect, useState } from 'react'

interface MealDrawerProps {
    meal: DailyMenuMeal | undefined
    isOpen: boolean
    onClose: () => void
    isReadOnly?: boolean
}

export const MealDrawer = ({ meal, isOpen, onClose, isReadOnly }: MealDrawerProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(isOpen)
    const { addOrUpdateOrder, activeShift } = useCartStore()

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
            setQuantity(1)
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

                    {isReadOnly && (
                        <DrawerFooter className='items-center justify-between my-4'>
                        </DrawerFooter>
                    )}
                    {!isReadOnly && (
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
                            {!activeShift && (
                                <div className='flex min-w-full bg-primary/50 rounded-md h-10 items-center justify-center'>
                                    <p className='text-sm text-gray-100 text-center'>Izaberite smenu da biste dodali obrok</p>
                                </div>
                            )}
                            {!!activeShift && (
                                <Button
                                    type='button'
                                    onClick={handleAddToOrder}
                                    loading={isLoading}
                                    className='flex min-w-full items-center justify-between gap-2'>
                                    <span>Dodaj u porudžbinu</span>
                                    <span className='font-semibold'>{(meal.price * quantity).toFixed(2)} RSD</span>
                                </Button>
                            )}
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
