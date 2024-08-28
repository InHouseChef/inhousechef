import { useAddIncrementOrderItemQuantity, useDecreaseOrderItemQuantity, usePlaceOrder } from '@/api/order'
import { useReadShift } from '@/api/shifts/repository/hooks/readShift'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePathParams } from '@/hooks'
import { CompanyPath, DateIso } from '@/types'
import { formatDateIso, formatTimeWithoutSeconds, toDateFromDateIso } from '@/utils/date'
import { useState } from 'react'
import { CartItem, useCartStore } from '../../../../state'
import { canScheduleOrder, getRemainingTimeToEditOrder } from '../../../../utils'

export const OrderDialog = () => {
    const path = usePathParams<CompanyPath>()
    const { carts, selectedShiftId, selectedDate, addToCart, removeFromCart, activeOrderId } = useCartStore()
    const { data: shift } = useReadShift({ path: { ...path, shiftId: selectedShiftId } })
    const [orderDate, setOrderDate] = useState<DateIso>(selectedDate)

    const { mutate: placeOrder } = usePlaceOrder()

    const { mutate: increaseItemQuantity } = useAddIncrementOrderItemQuantity()
    const { mutate: decreaseItemQuantity } = useDecreaseOrderItemQuantity()

    const cart = selectedShiftId && selectedDate ? carts[selectedShiftId]?.[selectedDate] || [] : []
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const handleIncreaseQuantity = (item: CartItem) => {
        addToCart({ ...item, quantity: 1 })
        increaseItemQuantity({
            path: {
                ...path,
                orderId: activeOrderId,
                skuId: item.id
            }
        })
    }

    const handleDecreaseQuantity = (item: CartItem) => {
        if (item.quantity > 1) {
            addToCart({ ...item, quantity: -1 })
            decreaseItemQuantity({
                path: { ...path, orderId: activeOrderId, skuId: item.id }
            })
        } else {
            removeFromCart(item.id)
        }
    }

    const handlePlaceOrder = () =>
        placeOrder(
            {
                path: { ...path, orderId: activeOrderId }
            },
            {
                onSuccess: data => {
                    setOrderDate(data.orderDate)
                }
            }
        )

    if (!shift) return

    const { shiftStartAt, shiftEndAt, orderingDeadlineBeforeShiftStart } = shift

    const remainingTime = getRemainingTimeToEditOrder(shift, toDateFromDateIso(orderDate))

    const remainingMinutes = Math.floor(remainingTime / (60 * 1000))
    return (
        <DialogContent className='max-w-screen h-screen'>
            <DialogHeader>
                <DialogTitle className='text-left text-3xl'>Vaša porudžbina</DialogTitle>
                <DialogDescription className='text-left'>
                    <div className='flex flex-col gap-2 rounded-lg border-2 px-4 py-2'>
                        <p>
                            Vaša porudžbina će biti uslužena u periodu od {formatTimeWithoutSeconds(shiftStartAt)} do{' '}
                            {formatTimeWithoutSeconds(shiftEndAt)} za dan {formatDateIso(orderDate)}
                        </p>
                        <p>
                            Porudžbinu možete izmeniti najkasnije do
                            {canScheduleOrder(shift, toDateFromDateIso(selectedDate)) && (
                                <span className='font-semibold'>{remainingMinutes}</span>
                            )}
                        </p>
                    </div>
                </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
                {cart.length === 0 ? (
                    <p>Vaša korpa je prazna</p>
                ) : (
                    <div>
                        {cart.map(item => (
                            <div key={item.id} className='flex items-center justify-between py-2'>
                                <div>
                                    <h4 className='font-semibold'>{item.name}</h4>
                                    <p className='text-sm text-gray-600'>{item.price.toFixed(2)} RSD</p>
                                </div>
                                <img src={item.imageUrl} alt={item.name} className='h-16 w-16 rounded-lg object-cover' />
                                <div className='flex items-center gap-4'>
                                    <Button variant='outline' onClick={() => handleDecreaseQuantity(item)}>
                                        -
                                    </Button>
                                    <span className=''>{item.quantity}</span>
                                    <Button variant='outline' onClick={() => handleIncreaseQuantity(item)}>
                                        +
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button onClick={handlePlaceOrder} type='button' className='flex w-full items-center justify-between'>
                    <span>Poruči </span>
                    <span>{totalPrice.toFixed(2)} RSD</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
