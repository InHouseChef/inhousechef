import { MealType } from '@/api/meals'
import { ReadShiftResponse } from '@/api/shifts'
import { DateIso } from '@/types'
import { toStringFromTime } from '@/utils/date'
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

interface CartStore {
    order: { [shiftId: string]: { [date: string]: CartItem[] } }
    selectedShift?: ReadShiftResponse
    selectedDate: DateIso
    selectedMealType: MealType
    activeOrderId: string
    setActiveOrderId: (orderId: string) => void
    setSelectedShift: (shift?: ReadShiftResponse) => void
    setSelectedDate: (date: DateIso) => void
    setSelectedMealType: (type: MealType) => void
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string) => void
    resetCart: () => void
    canScheduleOrder: () => boolean
    canImmediatelyOrder: () => boolean
}

export const useCartStore = create<CartStore>()(
    devtools(
        persist(
            (set, get) => ({
                order: {},
                selectedShift: {} as ReadShiftResponse,
                selectedDate: '',
                selectedMealType: 'MainCourse',
                activeOrderId: '',
                setSelectedShift: shift => set(() => ({ selectedShift: shift })),
                setSelectedDate: date => set(() => ({ selectedDate: date })),
                setSelectedMealType: (type: MealType) => set(() => ({ selectedMealType: type })),
                setActiveOrderId: orderId => set(() => ({ activeOrderId: orderId })),
                addToCart: item =>
                    set(state => {
                        const { selectedShift, selectedDate } = state
                        if (!selectedShift || !selectedDate) return state

                        const shiftCart = state.order[selectedShift.id] || {}
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
                                [selectedShift.id]: { ...shiftCart, [selectedDate]: dateCart }
                            }
                        }
                    }),
                removeFromCart: itemId =>
                    set(state => {
                        const { selectedShift, selectedDate } = state
                        if (!selectedShift || !selectedDate) return state

                        const shiftCart = state.order[selectedShift.id] || {}
                        const dateCart = shiftCart[selectedDate] || []
                        const updatedCart = dateCart.filter(item => item.id !== itemId)

                        return {
                            order: {
                                ...state.order,
                                [selectedShift.id]: { ...shiftCart, [selectedDate]: updatedCart }
                            }
                        }
                    }),
                clearCart: () =>
                    set(state => {
                        const { selectedShift, selectedDate } = state
                        if (!selectedShift || !selectedDate) return state

                        const shiftCart = state.order[selectedShift.id] || {}
                        return {
                            order: {
                                ...state.order,
                                [selectedShift.id]: { ...shiftCart, [selectedDate]: [] }
                            }
                        }
                    }),
                resetCart: () =>
                    set(() => ({
                        order: {},
                        selectedShift: undefined,
                        selectedDate: '',
                        activeOrderId: '',
                        selectedMealType: 'MainCourse'
                    })),
                canScheduleOrder: (): boolean => {
                    const { selectedShift, selectedDate } = get()
                    if (!selectedShift || !selectedDate) return false

                    const { shiftStartAt, orderingDeadlineBeforeShiftStart } = selectedShift
                    const shiftStart = toStringFromTime(shiftStartAt)
                    const currentTime = new Date().getTime()
                    const deadlineTime = shiftStart.getTime() - orderingDeadlineBeforeShiftStart * 60 * 60 * 1000 // convert hours to milliseconds

                    return currentTime < deadlineTime
                },
                canImmediatelyOrder: (): boolean => {
                    const { selectedShift } = get()
                    if (!selectedShift) return false

                    const { shiftEndAt } = selectedShift
                    const shiftEnd = toStringFromTime(shiftEndAt)
                    const currentTime = new Date().getTime()
                    const endTimeMinusOneHourThirtyMinutes = shiftEnd.getTime() - 1.5 * 60 * 60 * 1000

                    return currentTime < endTimeMinusOneHourThirtyMinutes
                }
            }),
            {
                name: 'cart'
            }
        )
    )
)
