import { DailyMenuMeal } from '@/api/daily-menus'
import { useCreateScheduledOrder } from '@/api/order'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { useState } from 'react'
import { useCartStore } from '../../../../state'

interface MealDrawerProps {
    meal: DailyMenuMeal
    isOpen: boolean

    onClose: () => void
}

export const MealDrawer = ({ meal, isOpen, onClose }: MealDrawerProps) => {
    const path = usePathParams<CompanyPath>()
    const { addToCart, selectedDate, selectedShift, setActiveOrderId } = useCartStore()
    const [quantity, setQuantity] = useState(1)

    const { id, name, description, price, imageUrl, type } = meal

    const { mutate: createScheduledOrder } = useCreateScheduledOrder()

    const handleAddToCart = () => {
        addToCart({
            id,
            name,
            price,
            quantity,
            imageUrl,
            type
        })
        createScheduledOrder(
            {
                path,
                body: {
                    shiftId: selectedShift?.id || '',
                    orderDate: selectedDate,
                    meals: [
                        {
                            id,
                            quantity
                        }
                    ]
                }
            },
            {
                onSuccess: data => {
                    setActiveOrderId(data.id)
                }
            }
        )
        onClose()
    }

    const handleQuantityChange = (increment: number) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + increment))
    }

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='text-left'>
                        {imageUrl ? (
                            <img src={imageUrl} alt={name} className='h-64 w-full rounded-lg object-cover' />
                        ) : (
                            <div className='flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gray-200 text-gray-600'>
                                No Image
                            </div>
                        )}
                        <DrawerTitle className='mt-2 text-3xl font-bold lowercase'>{name}</DrawerTitle>
                        <p className='font-semibold text-blue-500'>{price.toFixed(2)} RSD</p>
                        {description ? <p className='mt-4 text-sm text-gray-600'>{description}</p> : undefined}
                    </DrawerHeader>

                    <DrawerFooter className='items-center justify-between'>
                        {/* <div className='flex items-center space-x-2'>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 rounded-full'
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}>
                                <Minus width={24} height={24} />
                            </Button>
                            <div className='text-lg font-semibold'>{quantity}</div>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 rounded-full'
                                onClick={() => handleQuantityChange(1)}>
                                <Plus width={24} height={24} />
                            </Button>
                        </div> */}
                        <Button type='button' onClick={handleAddToCart} className='flex items-center space-x-2'>
                            <span>Dodaj u porudžbinu</span>
                            <span className='font-semibold'>{(price * quantity).toFixed(2)} RSD</span>
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
