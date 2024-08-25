import { create } from 'zustand'

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
    selectedDate: string
    setSelectedShift: (shiftId: string) => void
    setSelectedDate: (date: string) => void
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string) => void
    clearCart: () => void
    activeOrderId: string
    setActiveOrderId: (orderId: string) => void
}

export const useCartStore = create<CartState>(set => ({
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
        })
}))
