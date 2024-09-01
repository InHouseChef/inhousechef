import { ReadALaCardShiftResponse } from '@/api/alacard-shifts'
import { MealType } from '@/api/meals'
import { ReadMyOrderResponse } from '@/api/order'
import { ReadShiftResponse } from '@/api/shifts'
import { DateLocalIso } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Time } from '../utils'
import { toDateFromDateIsoLocal } from '@/utils/date'

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
    activeShift?: ReadShiftResponse
    aLaCardShift?: ReadALaCardShiftResponse
    activeDate: DateLocalIso
    mealType: MealType
    activeOrderId: string
    activeOrders: { [orderId: string]: ReadMyOrderResponse }
    setActiveOrder: (orderId: string, order: ReadMyOrderResponse) => void
    setActiveOrderId: (orderId: string) => void
    setActiveShift: (shift?: ReadShiftResponse) => void
    setALaCardShift: (shift?: ReadALaCardShiftResponse) => void
    setActiveDate: (date: DateLocalIso) => void
    setMealType: (type: MealType) => void
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string) => void
    resetCart: () => void
    canScheduleOrder: () => boolean
    canImmediatelyOrder: () => boolean
    isOpenCart: boolean
    setIsOpenCart: (open: boolean) => void
}

export const useCartStore = create<CartStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Persist these states
                order: {},
                activeOrders: {},
                activeDate: '',
                mealType: 'MainCourse',
                activeOrderId: '',

                // Do not persist dynamic data like shifts
                activeShift: undefined,
                aLaCardShift: undefined,

                isOpenCart: false,
                setIsOpenCart: open => set(() => ({ isOpenCart: open })),

                setActiveShift: shift => set(() => ({ activeShift: shift })),
                setALaCardShift: shift => set(() => ({ aLaCardShift: shift })),

                setActiveDate: date => set(() => ({ activeDate: date })),
                setMealType: type => set(() => ({ mealType: type })),

                setActiveOrderId: orderId => set(() => ({ activeOrderId: orderId })),
                setActiveOrder: (orderId, order) =>
                    set(state => ({
                        activeOrders: {
                            ...state.activeOrders,
                            [orderId]: order
                        }
                    })),

                addToCart: item =>
                    set(state => {
                        const { activeShift: selectedShift, activeDate: selectedDate } = state
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
                        const { activeShift, activeDate } = state
                        if (!activeShift || !activeDate) return state

                        const shiftCart = state.order[activeShift.id] || {}
                        const dateCart = shiftCart[activeDate] || []
                        const updatedCart = dateCart.filter(item => item.id !== itemId)

                        return {
                            order: {
                                ...state.order,
                                [activeShift.id]: { ...shiftCart, [activeDate]: updatedCart }
                            }
                        }
                    }),

                clearCart: () =>
                    set(state => {
                        const { activeShift, activeDate } = state
                        if (!activeShift || !activeDate) return state

                        const shiftCart = state.order[activeShift.id] || {}
                        return {
                            order: {
                                ...state.order,
                                [activeShift.id]: { ...shiftCart, [activeDate]: [] }
                            }
                        }
                    }),

                resetCart: () =>
                    set(() => ({
                        order: {},
                        activeShift: undefined,
                        activeDate: '',
                        activeOrderId: '',
                        mealType: 'MainCourse'
                    })),

                canScheduleOrder: (): boolean => {
                    const { activeShift, activeDate } = get()
                    if (!activeShift || !activeDate) return false

                    const { shiftStartAt, orderingDeadlineBeforeShiftStart } = activeShift

                    const dateFormatted = toDateFromDateIsoLocal(activeDate)
                    const shiftStartFormatted = Time.fromString(shiftStartAt)
                    const orderingDeadlineBeforeShiftStartFormatted = new Time(orderingDeadlineBeforeShiftStart)

                    const deadlineTimeFormatted = shiftStartFormatted.subtract(orderingDeadlineBeforeShiftStartFormatted)
                    const deadlineTime = deadlineTimeFormatted.toDate(dateFormatted).getTime()
                    const currentTime = new Date().getTime()

                    console.log(currentTime, deadlineTime)
                    console.log(currentTime < deadlineTime)

                    return currentTime < deadlineTime
                },

                canImmediatelyOrder: (): boolean => {
                    const { aLaCardShift } = get()

                    if (!aLaCardShift) return false
                    const { shiftStartAt, shiftEndAt } = aLaCardShift
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
                name: 'cart',
                partialize: state => ({
                    order: state.order,
                    activeOrders: state.activeOrders,
                    activeDate: state.activeDate,
                    mealType: state.mealType,
                    activeOrderId: state.activeOrderId
                })
            }
        )
    )
)
