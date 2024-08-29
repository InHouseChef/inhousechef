import { MealType } from '@/api/meals'
import { DateIso } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    quantity: number
    price: number
    imageUrl: string
    type: MealType
}

interface CartState {
    order: { [shiftId: string]: { [date: string]: CartItem[] } }
    selectedShiftId: string
    selectedDate: DateIso
    selectedMealType: MealType
    setSelectedShift: (shiftId: string) => void
    setSelectedDate: (date: DateIso) => void
    setSelectedMealType: (type: MealType) => void
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
                order: {},
                selectedShiftId: '',
                selectedDate: '',
                selectedMealType: 'MainCourse',
                activeOrderId: '',
                setSelectedShift: shiftId => set(() => ({ selectedShiftId: shiftId })),
                setSelectedDate: date => set(() => ({ selectedDate: date })),
                setSelectedMealType: (type: MealType) => set(() => ({ selectedMealType: type })),
                setActiveOrderId: orderId => set(() => ({ activeOrderId: orderId })),
                addToCart: item =>
                    set(state => {
                        const { selectedShiftId, selectedDate } = state
                        if (!selectedShiftId || !selectedDate) return state

                        const shiftCart = state.order[selectedShiftId] || {}
                        const dateCart = shiftCart[selectedDate] || []
                        const existingItemIndex = dateCart.findIndex(cartItem => cartItem.id === item.id)

                        if (existingItemIndex > -1) {
                            dateCart[existingItemIndex].quantity += item.quantity
                        } else {
                            dateCart.push(item)
                        }

                        return {
                            order: {
                                ...state.order,
                                [selectedShiftId]: { ...shiftCart, [selectedDate]: dateCart }
                            }
                        }
                    }),
                removeFromCart: itemId =>
                    set(state => {
                        const { selectedShiftId, selectedDate } = state
                        if (!selectedShiftId || !selectedDate) return state

                        const shiftCart = state.order[selectedShiftId] || {}
                        const dateCart = shiftCart[selectedDate] || []
                        const updatedCart = dateCart.filter(item => item.id !== itemId)

                        return {
                            order: {
                                ...state.order,
                                [selectedShiftId]: { ...shiftCart, [selectedDate]: updatedCart }
                            }
                        }
                    }),
                clearCart: () =>
                    set(state => {
                        const { selectedShiftId, selectedDate } = state
                        if (!selectedShiftId || !selectedDate) return state

                        const shiftCart = state.order[selectedShiftId] || {}
                        return {
                            order: {
                                ...state.order,
                                [selectedShiftId]: { ...shiftCart, [selectedDate]: [] }
                            }
                        }
                    }),
                resetCart: () =>
                    set(() => ({
                        order: {},
                        selectedShiftId: '',
                        selectedDate: '',
                        activeOrderId: '',
                        selectedMealType: 'MainCourse'
                    }))
            }),
            {
                name: 'cart'
            }
        )
    )
)
