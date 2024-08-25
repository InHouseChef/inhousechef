import { useAddIncrementOrderItemQuantity, useDecreaseOrderItemQuantity, usePlaceOrder } from '@/api/order'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { CartItem, useCartStore } from '../../../../state'

export const OrderDialog = () => {
    const path = usePathParams<CompanyPath>()
    const { carts, selectedShiftId, selectedDate, addToCart, removeFromCart, activeOrderId } = useCartStore()

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
        placeOrder({
            path: { ...path, orderId: activeOrderId }
        })

    return (
        <DialogContent className='max-w-screen h-screen'>
            <DialogHeader>
                <DialogTitle className='text-left text-3xl'>Vaša porudžbina</DialogTitle>
                <DialogDescription className='text-left'>Pregledajte i potvrdite vašu porudžbinu</DialogDescription>
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
                                    <p className='text-sm text-gray-600'>RSD {item.price.toFixed(2)}</p>
                                </div>
                                <div className='flex items-center'>
                                    <Button variant='outline' onClick={() => handleDecreaseQuantity(item)}>
                                        -
                                    </Button>
                                    <span className='mx-2'>{item.quantity}</span>
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
                    <span>RSD {totalPrice.toFixed(2)}</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
