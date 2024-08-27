import { DateIso } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    quantity: number
    price: number
    imageUrl: string
}

interface CartState {
    carts: { [shiftId: string]: { [date: string]: CartItem[] } }
    selectedShiftId: string
    selectedDate: DateIso
    setSelectedShift: (shiftId: string) => void
    setSelectedDate: (date: DateIso) => void
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string) => void
    clearCart: () => void
    activeOrderId: string
    setActiveOrderId: (orderId: string) => void
    resetCart: () => void
}

export const useCartStore = create<CartState>()(
    devtools(
        persist(
            set => ({
                carts: {},
                selectedShiftId: '',
                selectedDate: '',
                activeOrderId: '',
                setSelectedShift: shiftId => set(() => ({ selectedShiftId: shiftId })),

                setSelectedDate: date => set(() => ({ selectedDate: date })),

                setActiveOrderId: orderId => set(() => ({ activeOrderId: orderId })),

                addToCart: item =>
                    set(state => {
                        const { selectedShiftId, selectedDate } = state
                        if (!selectedShiftId || !selectedDate) return state

                        const shiftCart = state.carts[selectedShiftId] || {}
                        const dateCart = shiftCart[selectedDate] || []
                        const existingItemIndex = dateCart.findIndex(cartItem => cartItem.id === item.id)

                        if (existingItemIndex > -1) {
                            dateCart[existingItemIndex].quantity += item.quantity
                        } else {
                            dateCart.push(item)
                        }

                        return {
                            carts: {
                                ...state.carts,
                                [selectedShiftId]: { ...shiftCart, [selectedDate]: dateCart }
                            }
                        }
                    }),

                removeFromCart: itemId =>
                    set(state => {
                        const { selectedShiftId, selectedDate } = state
                        if (!selectedShiftId || !selectedDate) return state

                        const shiftCart = state.carts[selectedShiftId] || {}
                        const dateCart = shiftCart[selectedDate] || []
                        const updatedCart = dateCart.filter(item => item.id !== itemId)

                        return {
                            carts: {
                                ...state.carts,
                                [selectedShiftId]: { ...shiftCart, [selectedDate]: updatedCart }
                            }
                        }
                    }),

                clearCart: () =>
                    set(state => {
                        const { selectedShiftId, selectedDate } = state
                        if (!selectedShiftId || !selectedDate) return state

                        const shiftCart = state.carts[selectedShiftId] || {}
                        return {
                            carts: {
                                ...state.carts,
                                [selectedShiftId]: { ...shiftCart, [selectedDate]: [] }
                            }
                        }
                    }),
                resetCart: () => set(() => ({ carts: {}, selectedShiftId: '', selectedDate: '', activeOrderId: '' }))
            }),
            {
                name: 'cart'
            }
        )
    )
)
