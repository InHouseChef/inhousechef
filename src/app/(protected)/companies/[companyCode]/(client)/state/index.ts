import { create } from 'zustand'

interface CartItem {
    id: string
    name: string
    quantity: number
    price: number
    imageUrl: string
}

interface CartState {
    carts: { [shiftId: string]: { [date: string]: CartItem[] } }
    addToCart: (shiftId: string, date: string, item: CartItem) => void
    removeFromCart: (shiftId: string, date: string, itemId: string) => void
    clearCart: (shiftId: string, date: string) => void
}

export const useCartStore = create<CartState>(set => ({
    carts: {},
    addToCart: (shiftId, date, item) =>
        set(state => {
            const shiftCart = state.carts[shiftId] || {}
            const dateCart = shiftCart[date] || []
            const existingItemIndex = dateCart.findIndex(cartItem => cartItem.id === item.id)
            if (existingItemIndex > -1) {
                dateCart[existingItemIndex].quantity += item.quantity
            } else {
                dateCart.push(item)
            }
            return { carts: { ...state.carts, [shiftId]: { ...shiftCart, [date]: dateCart } } }
        }),
    removeFromCart: (shiftId, date, itemId) =>
        set(state => {
            const shiftCart = state.carts[shiftId] || {}
            const dateCart = shiftCart[date] || []
            const updatedCart = dateCart.filter(item => item.id !== itemId)
            return { carts: { ...state.carts, [shiftId]: { ...shiftCart, [date]: updatedCart } } }
        }),
    clearCart: (shiftId, date) =>
        set(state => {
            const shiftCart = state.carts[shiftId] || {}
            return { carts: { ...state.carts, [shiftId]: { ...shiftCart, [date]: [] } } }
        })
}))
