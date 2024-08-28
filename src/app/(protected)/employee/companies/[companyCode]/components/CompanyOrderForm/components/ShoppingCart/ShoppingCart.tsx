import { useReadShifts } from '@/api/shifts'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAppDate } from '@/hooks'
import { Minus, Plus, ShoppingCartIcon, Trash } from 'lucide-react'
import { useCartStore } from '../../../../state'

interface ShoppingCartProps {
    shiftId: string
    selectedDate: string
}

const ShoppingCart = ({ shiftId, selectedDate }: ShoppingCartProps) => {
    const { order, removeFromCart, clearCart, addToCart } = useCartStore()
    const cart = order[shiftId]?.[selectedDate] || []
    const { getFormattedAppDate } = useAppDate()
    const today = getFormattedAppDate()
    const { data: shifts } = useReadShifts()

    const currentShift = shifts?.find(shift => shift.id === shiftId)

    const totalAmount = cart.reduce((total, item) => total + item.quantity * item.price, 0)

    return (
        <Sheet>
            <SheetTrigger>
                <div className='relative flex items-center'>
                    <ShoppingCartIcon className='h-8 w-8 text-gray-700' />
                    {cart.length > 0 && (
                        <span className='absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                            {cart.length}
                        </span>
                    )}
                </div>
            </SheetTrigger>
            <SheetContent side='left' className='w-full bg-gray-100 p-6 md:w-[400px]'>
                <h4 className='mb-4 text-2xl font-medium text-gray-900'>{today}</h4>
                <h5 className='text-lg text-gray-600'>{currentShift?.name}</h5>

                {cart.length === 0 ? (
                    <div className='text-center text-gray-500'>Vaša korpa je prazna.</div>
                ) : (
                    <div className='space-y-6'>
                        <ul className='space-y-4'>
                            {cart.map((item, index) => (
                                <li key={index} className='flex items-center rounded-lg bg-white p-4 shadow-sm'>
                                    <div className='flex-shrink-0'>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className='rounded-lg object-cover'
                                            width={80}
                                            height={80}
                                        />
                                    </div>
                                    <div className='ml-4 flex-1'>
                                        <div className='flex items-center justify-between'>
                                            <h2 className='text-lg font-medium'>{item.name}</h2>
                                            <p className='text-gray-700'>
                                                {item.quantity * item.price} <em>RSD</em>
                                            </p>
                                        </div>
                                        <div className='mt-2 flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity === 1) {
                                                            removeFromCart(item.id)
                                                        } else {
                                                            addToCart({ ...item, quantity: -1 })
                                                        }
                                                    }}
                                                    className='text-gray-600'>
                                                    <Minus className='h-5 w-5' />
                                                </button>
                                                <Input
                                                    className='mx-2 w-12 rounded border text-center'
                                                    type='number'
                                                    value={item.quantity}
                                                    min='1'
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => addToCart({ ...item, quantity: 1 })}
                                                    className='text-gray-600'>
                                                    <Plus className='h-5 w-5' />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className='text-red-500 hover:text-red-700'>
                                                <Trash className='h-5 w-5' />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className='flex justify-between text-lg font-semibold'>
                            <span>Ukupno</span>
                            <span>
                                {totalAmount} <em>RSD</em>
                            </span>
                        </div>
                    </div>
                )}

                {cart.length > 0 && (
                    <div className='mt-6 space-y-4'>
                        <button
                            onClick={clearCart}
                            className='flex w-full items-center justify-center rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50'
                            data-testid='cart-delete-button'>
                            <Trash className='mr-2 h-4 w-4' /> Obriši
                        </button>

                        <button
                            className='flex w-full items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600'
                            data-testid='cart-save-button'>
                            Poruči
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default ShoppingCart
