import { useAddIncrementOrderItemQuantity, useDecreaseOrderItemQuantity, useDeleteOrder, usePlaceOrder } from '@/api/order'
import { useReadShift } from '@/api/shifts/repository/hooks/readShift'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePathParams } from '@/hooks'
import { CompanyPath, DateIso } from '@/types'
import { formatDateIso, formatEuropeanDate, formatTimeWithoutSeconds } from '@/utils/date'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { CartItem, useCartStore } from '../../../../state'
import { Time } from '../../../../utils'
import { OrderDialogMainCourseDrawer } from './components/OrderDialogMainCourseDrawer'
import { OrderDialogSideDishDrawer } from './components/OrderDialogSideDishDrawer'

export const OrderDialog = () => {
    const path = usePathParams<CompanyPath>()
    const {
        order,
        selectedShift,
        canImmediatelyOrder,
        canScheduleOrder,
        selectedDate,
        addToCart,
        removeFromCart,
        activeOrderId
    } = useCartStore()
    const { data: shift } = useReadShift({ path: { ...path, shiftId: selectedShift?.id || '' } })
    const [orderDate, setOrderDate] = useState<DateIso>(selectedDate)
    const [isOpenMainCourseDrawer, setIsOpenMainCourseDrawer] = useState(false)
    const [isOpenSideDishDrawer, setIsOpenSideDishDrawer] = useState(false)

    const { mutate: placeOrder } = usePlaceOrder()
    const { mutate: deleteOrder } = useDeleteOrder()
    const { mutate: increaseItemQuantity } = useAddIncrementOrderItemQuantity()
    const { mutate: decreaseItemQuantity } = useDecreaseOrderItemQuantity()

    const cart = selectedShift?.id && selectedDate ? order[selectedShift?.id]?.[selectedDate] || [] : []
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

    const time1 = Time.fromString(shiftStartAt as string)
    const deadLine = new Time(orderingDeadlineBeforeShiftStart)

    const timeLeft = time1.subtract(deadLine)

    const handleDeleteOrder = () => deleteOrder({ path: { ...path, orderId: activeOrderId } })

    if (!canScheduleOrder() && !canImmediatelyOrder()) return

    return (
        <>
            <DialogContent className='max-w-screen h-screen'>
                <DialogHeader className='gap-4'>
                    <DialogTitle className='text-left text-3xl'>Vaša porudžbina</DialogTitle>
                    <DialogDescription className='text-left'>
                        <div className='flex flex-col gap-2 rounded-lg border-2 px-4 py-2'>
                            <span>
                                Vaša porudžbina će biti uslužena u periodu od {formatTimeWithoutSeconds(shiftStartAt)} do{' '}
                                {formatTimeWithoutSeconds(shiftEndAt)} za dan {formatEuropeanDate(formatDateIso(orderDate))}
                            </span>
                            <span>
                                Porudžbinu možete izmeniti najkasnije do&nbsp;
                                {canScheduleOrder() && <span className='font-semibold'>{timeLeft.toString()}</span>}
                            </span>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4'>
                    {cart.length === 0 ? (
                        <p>Vaša korpa je prazna</p>
                    ) : (
                        <div>
                            {/* Filter meals by type: Main Courses */}
                            {cart.filter(item => item.type === 'MainCourse').length > 0 && (
                                <div className='flex flex-col gap-2 rounded-lg bg-slate-500 px-4 py-2'>
                                    <h3 className='text-lg font-semibold'>Glavna jela</h3>
                                    <div className='flex flex-col gap-4'>
                                        {cart
                                            .filter(item => item.type === 'MainCourse')
                                            .map(item => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className='flex items-center justify-between rounded-lg bg-slate-200 p-2'>
                                                        <div className='flex items-center gap-4'>
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                className='h-16 w-16 rounded-lg object-cover'
                                                            />
                                                            <div>
                                                                <h4 className='font-semibold'>{item.name}</h4>
                                                                <p className='text-sm text-gray-600'>
                                                                    {item.price.toFixed(2)} RSD
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <Button
                                                                size='icon'
                                                                variant='secondary'
                                                                className=''
                                                                onClick={() => handleDecreaseQuantity(item)}>
                                                                <Minus />
                                                            </Button>
                                                            <span className='w-4 text-center'>{item.quantity}</span>
                                                            <Button
                                                                size='icon'
                                                                variant='secondary'
                                                                onClick={() => handleIncreaseQuantity(item)}>
                                                                <Plus />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                    <Button
                                        variant='ghost'
                                        className='justify-end'
                                        onClick={() => {
                                            setIsOpenMainCourseDrawer(true)
                                        }}>
                                        Dodaj još glavnih jela
                                    </Button>
                                </div>
                            )}

                            {cart.filter(item => item.type === 'MainCourse').length > 0 &&
                                cart.filter(item => item.type === 'SideDish').length > 0 && (
                                    <div className='my-4 border-t border-gray-300' />
                                )}

                            {cart.filter(item => item.type === 'SideDish').length > 0 && (
                                <div className='flex flex-col gap-2 rounded-lg bg-slate-500 px-4'>
                                    <h3 className='text-lg font-semibold'>Dodaci</h3>
                                    <div className='flex flex-col gap-4'>
                                        {cart
                                            .filter(item => item.type === 'SideDish')
                                            .map(item => (
                                                <div
                                                    key={item.id}
                                                    className='flex items-center justify-between rounded-lg bg-slate-200 p-2'>
                                                    <div className='flex items-center gap-4'>
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className='h-16 w-16 rounded-lg object-cover'
                                                        />
                                                        <h4 className='font-semibold'>{item.name}</h4>
                                                        <p className='text-sm text-gray-600'>{item.price.toFixed(2)} RSD</p>
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <Button
                                                            size='icon'
                                                            variant='secondary'
                                                            onClick={() => handleDecreaseQuantity(item)}>
                                                            <Minus />
                                                        </Button>
                                                        <span className='w-4 text-center'>{item.quantity}</span>
                                                        <Button
                                                            size='icon'
                                                            variant='secondary'
                                                            onClick={() => handleIncreaseQuantity(item)}>
                                                            <Plus />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <Button
                                        variant='ghost'
                                        className='justify-end'
                                        onClick={() => {
                                            setIsOpenSideDishDrawer(true)
                                        }}>
                                        Dodaj još dodataka
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter className='gap-4'>
                    <Button onClick={handlePlaceOrder} type='button' className='flex w-full items-center justify-between'>
                        <span>Poruči </span>
                        <span>{totalPrice.toFixed(2)} RSD</span>
                    </Button>
                    {activeOrderId ? (
                        <Button variant='destructive' onClick={handleDeleteOrder}>
                            Otkaži porudžbinu
                        </Button>
                    ) : undefined}
                </DialogFooter>
            </DialogContent>
            <OrderDialogMainCourseDrawer isOpen={isOpenMainCourseDrawer} onClose={() => setIsOpenMainCourseDrawer(false)} />
            <OrderDialogSideDishDrawer isOpen={isOpenSideDishDrawer} onClose={() => setIsOpenSideDishDrawer(false)} />
        </>
    )
}
