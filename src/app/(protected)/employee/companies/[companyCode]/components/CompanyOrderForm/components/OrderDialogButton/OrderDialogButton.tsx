import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useMemo } from 'react'
import { useCartStore } from '../../../../state'
import { OrderDialog } from '../OrderDialog/OrderDialog'

export const OrderDialogButton = () => {
    const { carts, selectedShiftId, selectedDate } = useCartStore()

    const cart = carts[selectedShiftId]?.[selectedDate] || []
    const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart])
    const totalPrice = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart])

    if (totalItems === 0) return null

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 p-4 shadow-lg'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex w-full items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <span className='flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-semibold text-black'>
                                {totalItems}
                            </span>
                            <span>Pregledaj porudžbinu</span>
                        </div>
                        <span className='font-semibold'>RSD {totalPrice.toFixed(2)}</span>
                    </Button>
                </DialogTrigger>
                <OrderDialog />
            </Dialog>
        </div>
    )
}
