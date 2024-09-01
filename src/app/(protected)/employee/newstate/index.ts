import { ReadALaCardMenuResponse } from '@/api/alacard-menus'
import { ReadDailyMenuResponse } from '@/api/daily-menus'
import { ReadMyOrderResponse } from '@/api/order'
import { RolesEnum } from '@/api/users'
import { axiosPrivate } from '@/lib/axios'
import { DateLocalIso, DateTimeIsoUtc, OrderState, OrderType, Time } from '@/types'
import { createBaseUrlQuery, createUrlParams } from '@/utils'
import { getToLocalISOString } from '@/utils/date'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type MealType = 'MainCourse' | 'SideDish'

export interface Shift {
    id: string
    shiftStartAt: Time // Format: 'HH:mm'
    shiftEndAt: Time // Format: 'HH:mm'
    orderingDeadlineBeforeShiftStart: number // Number of hours before start time for order deadline (for Regular shifts)
}

export interface ALaCarteShift {
    id: string
    shiftStartAt: Time // Format: 'HH:mm'
    shiftEndAt: Time // Format: 'HH:mm'
}

export type OrderItem = {
    skuId: string
    name: string
    price: number
    productionPrice: number
    quantity: number
    imageUrl: string
    type: MealType
}

export interface ImmediateOrderDetails {
    id: string
    number: string
    companyId: string
    customerId: string
    state: OrderState
    type: OrderType
    orderDate: DateLocalIso
    orderItems: OrderItem[]
    placedAt?: DateTimeIsoUtc
    confirmedAt?: DateTimeIsoUtc
}

export interface ScheduledOrderDetails {
    id: string
    number: string
    companyId: string
    customerId: string
    state: OrderState
    type: OrderType
    orderDate: DateLocalIso
    orderedForShiftId?: string
    orderItems: OrderItem[]
    placedAt?: DateTimeIsoUtc
    confirmedAt?: DateTimeIsoUtc
}

export interface CartStore {
    companyCode?: string
    userRole: RolesEnum
    hasALaCardPermission: boolean
    activeDay: DateLocalIso // ISO date string
    activeShift?: Shift | ALaCarteShift
    activeMenus?: ReadDailyMenuResponse[]
    activeALaCarteMenus?: ReadALaCardMenuResponse[]
    regularShifts: Shift[]
    aLaCarteShift?: ALaCarteShift
    immediateOrders: ReadMyOrderResponse[]
    scheduledOrders: ReadMyOrderResponse[]
    selectedOrder?: ScheduledOrderDetails | ImmediateOrderDetails

    // State management actions
    setActiveDay: (day: DateLocalIso) => void
    setActiveShift: (shiftId: string | undefined) => void
    setSelectedOrderById: (orderId: string) => Promise<void>
    setMenus: (menu: ReadDailyMenuResponse, aLaCarteMenu?: ReadDailyMenuResponse) => void
    addOrder: (order: ScheduledOrderDetails | ImmediateOrderDetails) => void
    updateOrder: (orderId: string, orderItems: OrderItem[]) => void
    cancelOrder: () => Promise<void>
    placeOrder: () => Promise<void>
    confirmOrder: (orderId: string) => void
    updateSelectedOrder(): void
    clearSelectedOrder: () => void
    resetCart: () => void
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

    // API integration placeholders
    fetchShifts: () => Promise<void>
    fetchMenus: (fromDay: DateLocalIso, toDay: DateLocalIso) => Promise<void>
    fetchImmediateOrders: (fromDate: DateLocalIso, toDate: DateLocalIso) => Promise<void>
    fetchScheduledOrders: (fromDate: DateLocalIso, toDate: DateLocalIso) => Promise<void>
    loadCartData: (companyCode: string, role: RolesEnum, hasALaCardPermission: boolean) => Promise<void>

    addOrUpdateOrder: (mealId: string, quantity: number) => void

    // Error handling
    message?: {
        text?: string
        description?: string
    }
    messageType?: 'error' | 'success'
    setMessage: (
        message?: {
            text?: string
            description?: string
        },
        type?: 'error' | 'success'
    ) => void
}

const api = {
    fetchRegularShifts: (companyCode: string) => {
        return axiosPrivate.get(`/companies/${companyCode}/shifts`)
    },

    fetchALaCarteShift: (companyCode: string) => {
        return axiosPrivate.get(`/companies/${companyCode}/a-la-card-shifts`)
    },

    fetchDailyMenu: (from: string, to: string) => {
        return axiosPrivate.get(`/daily-menus?${createUrlParams({ From: from, To: to })}`)
    },

    fetchALaCarteMenu: (from: string, to: string) => {
        return axiosPrivate.get(`/alacard-menus?${createUrlParams({ From: from, To: to })}`)
    },

    fetchImmediateOrders: (companyCode: string, fromDate: DateLocalIso, toDate: DateLocalIso) => {
        return axiosPrivate.get(
            `/companies/${companyCode}/orders/me?${createBaseUrlQuery({
                filter: { fromDate: fromDate, toDate: toDate, orderStates: ['Draft', 'Placed'], orderTypes: ['Immediate'] }
            })}`
        )
    },

    fetchScheduledOrders: (companyCode: string, fromDate: DateLocalIso, toDate: DateLocalIso) => {
        return axiosPrivate.get(
            `/companies/${companyCode}/orders/me?${createBaseUrlQuery({
                filter: { fromDate: fromDate, toDate: toDate, orderStates: ['Draft', 'Placed'], orderTypes: ['Scheduled'] }
            })}`
        )
    },

    addOrderItem: (companyCode: string, orderId: string, skuId: string, data: { quantity: number }) => {
        return axiosPrivate.post(`/companies/${companyCode}/orders/${orderId}/items/${skuId}/add`, data)
    },

    decreaseOrderItemQuantity: (companyCode: string, orderId: string, skuId: string) => {
        return axiosPrivate.patch(`/companies/${companyCode}/orders/${orderId}/items/${skuId}/decrease-quantity`)
    },

    cancelOrder: (companyCode: string, orderId: string) => {
        return axiosPrivate.delete(`/companies/${companyCode}/orders/${orderId}`)
    },

    createScheduledOrder: (
        companyCode: string,
        data: { shiftId: string; orderDate: DateLocalIso; meals: { id: string; quantity: number }[] }
    ) => {
        return axiosPrivate.post(`/companies/${companyCode}/orders/scheduled`, data)
    },

    createImmediateOrder: (companyCode: string, data: { meals: { id: string; quantity: number }[] }) => {
        return axiosPrivate.post(`/companies/${companyCode}/orders/immediate`, data)
    },

    confirmImmediateOrder: (companyCode: string, orderId: string, data: {}) => {
        return axiosPrivate.post(`/companies/${companyCode}/orders/${orderId}/immediate/status/confirmed`, data)
    },

    placeOrder: (companyCode: string, orderId: string) => {
        return axiosPrivate.post(`/companies/${companyCode}/orders/${orderId}/status/placed`)
    }
}

export const useCartStore = create<CartStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                companyCode: undefined,
                userRole: RolesEnum.Employee,
                hasALaCardPermission: false,
                activeDay: getToLocalISOString(new Date()).split('T')[0] as DateLocalIso,
                regularShifts: [],
                immediateOrders: [],
                scheduledOrders: [],
                selectedOrder: undefined,
                isOpen: false,
                message: {
                    text: '',
                    description: ''
                },
                messageType: undefined,

                clearSelectedOrder: () => {
                    set(state => {
                        state.selectedOrder = undefined
                    })
                },

                setIsOpen: (isOpen: boolean) => {
                    set(state => {
                        state.isOpen = isOpen
                    })
                },

                setActiveDay: async (day: DateLocalIso) => {
                    set(state => {
                        state.activeDay = day
                        state.selectedOrder = undefined // Reset selected order when day changes
                    })

                    // Refetch menus and orders for the selected day
                    await get().fetchMenus(day, day)
                    await Promise.all([get().fetchImmediateOrders(day, day), get().fetchScheduledOrders(day, day)])

                    // // Determine the correct order for the new day and shift
                    get().updateSelectedOrder()
                },

                setActiveShift: async (shiftId: string | undefined) => {
                    const shift =
                        get().regularShifts.find(s => s.id === shiftId) ||
                        (get().hasALaCardPermission ? get().aLaCarteShift : undefined)
                    if (shift) {
                        set(state => {
                            state.activeShift = shift
                            state.selectedOrder = undefined // Reset selected order when shift changes
                        })

                        const activeDay = get().activeDay

                        // Refetch menus and orders for the selected shift and day
                        await get().fetchMenus(activeDay, activeDay)
                        await Promise.all([
                            get().fetchImmediateOrders(activeDay, activeDay),
                            get().fetchScheduledOrders(activeDay, activeDay)
                        ])

                        // Determine the correct order for the new shift and day
                        get().updateSelectedOrder()
                    }
                },

                updateSelectedOrder: () => {
                    const { activeDay, activeShift, immediateOrders, scheduledOrders } = get()
                    if (!activeShift) return

                    const isALaCarteShift = activeShift.id === get().aLaCarteShift?.id

                    // if is an a la carte shift find an order by order date from the immediate orders
                    // otherwise find an order by order date and ordered for shift id from the scheduled orders

                    if (isALaCarteShift) {
                        const foundOrder = immediateOrders.find(order => order.orderDate === activeDay)
                        set(state => {
                            state.selectedOrder = foundOrder || undefined
                        })
                        return
                    } else {
                        const foundOrder = scheduledOrders.find(
                            order => order.orderDate === activeDay && order.orderedForShiftId === activeShift.id
                        )
                        set(state => {
                            state.selectedOrder = foundOrder || undefined
                        })
                    }
                },

                setSelectedOrderById: async (orderId: string) => {
                    let immediateOrder = get().immediateOrders.find(order => order.id === orderId)
                    let scheduledOrder = get().scheduledOrders.find(order => order.id === orderId)

                    // If the order is not found in the current state, fetch the data from the API
                    if (!immediateOrder && !scheduledOrder) {
                        const companyCode = get().companyCode!
                        const today = getToLocalISOString(new Date()).split('T')[0] as DateLocalIso
                        const tomorrow = getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0] as DateLocalIso

                        // Refetch menus and orders for the selected shift and day
                        await get().fetchMenus(today, tomorrow)

                        const [immediateOrdersResponse, scheduledOrdersResponse] = await Promise.all([
                            api.fetchImmediateOrders(companyCode, today, tomorrow),
                            api.fetchScheduledOrders(companyCode, today, tomorrow)
                        ])

                        set(state => {
                            state.immediateOrders = immediateOrdersResponse
                            state.scheduledOrders = scheduledOrdersResponse
                        })

                        // Try to find the order again after fetching data
                        immediateOrder = get().immediateOrders.find(order => order.id === orderId)
                        scheduledOrder = get().scheduledOrders.find(order => order.id === orderId)
                    }

                    // Set the found order or keep it undefined if still not found
                    set(state => {
                        state.selectedOrder = immediateOrder || scheduledOrder
                    })
                },

                setMenus: (menu: ReadDailyMenuResponse, aLaCarteMenu?: ReadDailyMenuResponse) => {
                    set(state => {
                        state.activeMenus = menu
                        if (get().hasALaCardPermission && aLaCarteMenu) {
                            state.activeALaCarteMenus = aLaCarteMenu
                        }
                    })
                },

                addOrder: async (order: ScheduledOrderDetails) => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        set(state => {
                            state.scheduledOrders.push(order as ReadMyOrderResponse)
                        })
                        await api.createScheduledOrder(companyCode, {
                            shiftId: order.orderedForShiftId || '',
                            orderDate: order.orderDate,
                            meals: order.orderItems.map(item => ({
                                id: item.skuId,
                                quantity: item.quantity
                            }))
                        })
                    }
                },

                updateOrder: async (orderId: string, orderItems: OrderItem[]) => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        const orderType = get().selectedOrder?.type === 'Immediate' ? 'immediateOrders' : 'scheduledOrders'
                        set(state => {
                            const orderIndex = state[orderType].findIndex(order => order.id === orderId)
                            if (orderIndex !== -1) {
                                state[orderType][orderIndex].orderItems = orderItems.map(meal => ({
                                    skuId: meal.skuId,
                                    name: meal.name,
                                    price: meal.price,
                                    productionPrice: meal.price, // assuming production price is same as meal price
                                    quantity: meal.quantity,
                                    imageUrl: meal.imageUrl,
                                    type: meal.type
                                }))
                            }
                        })
                        await api.addOrderItem(companyCode, orderId, orderItems[0].skuId, {
                            quantity: orderItems[0].quantity
                        })
                    }
                },

                cancelOrder: async () => {
                    const state = get()
                    const { selectedOrder, companyCode, activeShift, activeDay } = state

                    if (!companyCode || !selectedOrder) return

                    const orderId = selectedOrder.id
                    const orderType = selectedOrder.type === 'Immediate' ? 'immediateOrders' : 'scheduledOrders'

                    try {
                        // Call the API to cancel the order
                        await api.cancelOrder(companyCode, orderId)

                        // After successful API call, update the state to remove the order
                        set(state => {
                            const orderIndex = state[orderType].findIndex(order => order.id === orderId)
                            if (orderIndex !== -1) {
                                // Remove the order from the state
                                state[orderType].splice(orderIndex, 1)
                                state.selectedOrder = undefined // Clear the selected order
                            }
                        })
                        get().setMessage(
                            {
                                text: 'Porudžbina je uspešno otkazana.',
                                description: 'Vašu porudžbinu možete pogledati u istoriji porudžbina.'
                            },
                            'success'
                        )
                    } catch (error) {
                        get().setMessage(
                            {
                                text: 'Otkazivanje porudžbine nije uspelo.',
                                description: 'Molimo pokušajte ponovo.'
                            },
                            'error'
                        )
                    }
                },

                confirmOrder: async (orderId: string) => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        await api.confirmImmediateOrder(companyCode, orderId, {})
                    }
                },

                resetCart: () => {
                    set(state => {
                        state.activeShift = undefined
                        state.activeMenus = undefined
                        state.activeALaCarteMenus = undefined
                        state.immediateOrders = []
                        state.scheduledOrders = []
                        state.selectedOrder = undefined
                    })
                },

                fetchShifts: async () => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        const [regularShifts, aLaCarteShift] = await Promise.all([
                            api.fetchRegularShifts(companyCode),
                            api.fetchALaCarteShift(companyCode)
                        ])
                        set(state => {
                            state.regularShifts = regularShifts
                            state.aLaCarteShift = aLaCarteShift
                        })
                    }
                },

                fetchMenus: async (fromDay: DateLocalIso, toDay: DateLocalIso) => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        const [dailyMenuList, aLaCarteMenuList] = await Promise.all([
                            api.fetchDailyMenu(fromDay, toDay),
                            api.fetchALaCarteMenu(fromDay, toDay)
                        ])
                        set(state => {
                            state.activeMenus = dailyMenuList
                            state.activeALaCarteMenus = aLaCarteMenuList
                        })
                    }
                },

                fetchImmediateOrders: async (day: DateLocalIso) => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        const orders = await api.fetchImmediateOrders(companyCode, day, day)
                        set(state => {
                            state.immediateOrders = orders
                        })
                    }
                },

                fetchScheduledOrders: async (day: DateLocalIso) => {
                    const companyCode = get().companyCode
                    if (companyCode) {
                        const orders = await api.fetchScheduledOrders(companyCode, day, day)
                        set(state => {
                            state.scheduledOrders = orders
                        })
                    }
                },

                placeOrder: async () => {
                    const state = get()
                    const { selectedOrder, companyCode } = state

                    if (!companyCode || !selectedOrder) return

                    const orderId = selectedOrder.id

                    try {
                        // Call the API to place the order and get the updated order back
                        const updatedOrder = await api.placeOrder(companyCode, orderId)

                        // Update the state with the returned order
                        set(state => {
                            const orderType = selectedOrder.type === 'Immediate' ? 'immediateOrders' : 'scheduledOrders'
                            const orderIndex = state[orderType].findIndex(order => order.id === orderId)
                            if (orderIndex !== -1) {
                                state[orderType][orderIndex] = updatedOrder
                            } else {
                                state[orderType].push(updatedOrder)
                            }
                            state.selectedOrder = updatedOrder // Update the selected order with the placed order
                        })
                        get().setMessage(
                            {
                                text: 'Porudžbina je uspešno poslata.',
                                description: 'Vašu porudžbinu možete pogledati u mojim porudžbinama.'
                            },
                            'success'
                        )
                    } catch (error) {
                        get().setMessage({
                            text: 'Slanje porudžbine nije uspelo.',
                            description: 'Molimo pokušajte ponovo.'
                        })
                    }
                },

                addOrUpdateOrder: async (mealId: string, quantity: number) => {
                    const state = get()
                    const { activeShift, selectedOrder, activeDay, companyCode, immediateOrders, scheduledOrders } = state

                    if (!companyCode || !activeShift) return

                    const isALaCarteShift = activeShift.id === state.aLaCarteShift?.id
                    let updatedOrder: ScheduledOrderDetails | ImmediateOrderDetails | undefined

                    if (selectedOrder && selectedOrder.type === (isALaCarteShift ? 'Immediate' : 'Scheduled')) {
                        if (quantity > 0) {
                            updatedOrder = await api.addOrderItem(companyCode, selectedOrder.id, mealId, { quantity })
                        } else {
                            updatedOrder = await api.decreaseOrderItemQuantity(companyCode, selectedOrder.id, mealId)
                        }
                    } else {
                        const existingOrder = (isALaCarteShift ? immediateOrders : scheduledOrders).find(
                            order => order.orderDate === activeDay && order.orderedForShiftId === activeShift.id
                        )

                        if (existingOrder) {
                            if (quantity > 0) {
                                updatedOrder = await api.addOrderItem(companyCode, existingOrder.id, mealId, { quantity })
                            } else {
                                updatedOrder = await api.decreaseOrderItemQuantity(companyCode, existingOrder.id, mealId)
                            }
                        } else if (quantity > 0) {
                            if (isALaCarteShift) {
                                updatedOrder = await api.createImmediateOrder(companyCode, {
                                    meals: [{ id: mealId, quantity }]
                                })
                                set(state => {
                                    state.immediateOrders.push(updatedOrder)
                                })
                            } else {
                                updatedOrder = await api.createScheduledOrder(companyCode, {
                                    shiftId: activeShift.id,
                                    orderDate: activeDay,
                                    meals: [{ id: mealId, quantity }]
                                })
                                set(state => {
                                    state.scheduledOrders.push(updatedOrder)
                                })
                            }
                        }
                    }

                    // Update the selected order in the store with the full order aggregate
                    if (updatedOrder) {
                        set(state => {
                            state.selectedOrder = updatedOrder
                            if (updatedOrder.type === 'Immediate') {
                                state.immediateOrders = state.immediateOrders.map(order =>
                                    order.id === updatedOrder.id ? updatedOrder : order
                                )
                            } else {
                                state.scheduledOrders = state.scheduledOrders.map(order =>
                                    order.id === updatedOrder.id ? updatedOrder : order
                                )
                            }
                        })
                    }
                },
                loadCartData: async (companyCode: string, userRole: RolesEnum, hasALaCardPermission: boolean) => {
                    set(state => {
                        state.companyCode = companyCode
                        state.userRole = userRole
                        state.hasALaCardPermission = hasALaCardPermission
                        if (!hasALaCardPermission) {
                            // Default active day to tomorrow if no A La Carte permission
                            state.activeDay = getToLocalISOString(new Date(Date.now() + 86400000)).split(
                                'T'
                            )[0] as DateLocalIso
                        }
                    })

                    const [
                        regularShiftsResponse,
                        aLaCarteShiftResponse,
                        dailyMenuResponseTodayList,
                        dailyMenuResponseTomorrow,
                        aLaCarteMenuResponse
                    ] = await Promise.all([
                        api.fetchRegularShifts(companyCode),
                        hasALaCardPermission ? api.fetchALaCarteShift(companyCode) : Promise.resolve(undefined),
                        api.fetchDailyMenu(
                            getToLocalISOString(new Date()).split('T')[0],
                            getToLocalISOString(new Date()).split('T')[0]
                        ),
                        api.fetchDailyMenu(
                            getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0],
                            getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0]
                        ),
                        hasALaCardPermission
                            ? api.fetchALaCarteMenu(
                                  getToLocalISOString(new Date()).split('T')[0],
                                  getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0]
                              )
                            : Promise.resolve(undefined)
                    ])

                    set(state => {
                        state.regularShifts = regularShiftsResponse
                        if (hasALaCardPermission) {
                            state.aLaCarteShift = aLaCarteShiftResponse
                            state.activeALaCarteMenus = aLaCarteMenuResponse
                        }
                        state.activeMenus = dailyMenuResponseTodayList
                    })

                    const [scheduledOrdersResponse, immediateOrdersResponse] = await Promise.all([
                        api.fetchScheduledOrders(
                            companyCode,
                            getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0] as DateLocalIso,
                            getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0] as DateLocalIso
                        ),
                        hasALaCardPermission
                            ? api.fetchImmediateOrders(
                                  companyCode,
                                  getToLocalISOString(new Date()).split('T')[0] as DateLocalIso,
                                  getToLocalISOString(new Date()).split('T')[0] as DateLocalIso
                              )
                            : Promise.resolve([])
                    ])

                    set(state => {
                        state.scheduledOrders = scheduledOrdersResponse
                        if (hasALaCardPermission) {
                            state.immediateOrders = immediateOrdersResponse
                        }
                    })
                },
                setMessage: (
                    message?: {
                        text?: string
                        description?: string
                    },
                    type?: 'error' | 'success'
                ) => {
                    set(state => {
                        state.message = message
                        state.messageType = type
                    })
                }
            })),
            {
                name: 'cart-store' // Storage key
            }
        )
    )
)
