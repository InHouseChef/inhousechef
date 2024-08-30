import { ReadALaCardShiftResponse } from '@/api/alacard-shifts'
import { MealType } from '@/api/meals'
import { ReadShiftResponse } from '@/api/shifts'
import { DateIso } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Time } from '../utils'

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
    aLaCardShift?: ReadALaCardShiftResponse
    selectedDate: DateIso
    selectedMealType: MealType
    activeOrderId: string
    setActiveOrderId: (orderId: string) => void
    setSelectedShift: (shift?: ReadShiftResponse) => void
    setALaCardShift: (shift?: ReadALaCardShiftResponse) => void
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
                setALaCardShift: shift => set(() => ({ aLaCardShift: shift })),
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
                    // const { selectedShift, selectedDate } = get()
                    // if (!selectedShift || !selectedDate) return false

                    // const { shiftStartAt, orderingDeadlineBeforeShiftStart } = selectedShift

                    // const dateFormatted = toDateFromDateIso(selectedDate)
                    // const shiftStartFormatted = Time.fromString(shiftStartAt)
                    // const orderingDeadlineBeforeShiftStartFormatted = new Time(orderingDeadlineBeforeShiftStart)

                    // // Subtract ordering deadline from shift start
                    // const deadlineTimeFormatted = shiftStartFormatted.subtract(orderingDeadlineBeforeShiftStartFormatted)
                    // const deadlineTime = deadlineTimeFormatted.toDate(dateFormatted).getTime()
                    // const currentTime = new Date().getTime()

                    return true
                },
                canImmediatelyOrder: (): boolean => {
                    const { aLaCardShift } = get()

                    if (!aLaCardShift) return false
                    const { shiftStartAt, shiftEndAt } = aLaCardShift
                    // @ts-ignore
                    const shiftStartFormatted = Time.fromString(shiftStartAt)
                    const shiftEndFormatted = Time.fromString(shiftEndAt)
                    const currentDate = new Date()

                    const shiftStart = shiftStartFormatted.toDate(currentDate).getTime()
                    const shiftEnd = shiftEndFormatted.toDate(currentDate).getTime()

                    const currentTime = currentDate.getTime()

                    return currentTime >= shiftStart && currentTime < shiftEnd
                }
            }),
            {
                name: 'cart'
            }
        )
    )
)
