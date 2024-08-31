import { DateIso, DateTimeIsoUtc, OrderState, OrderType } from '@/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { axiosPrivate } from '@/lib/axios';
import { createBaseUrlQuery, createUrlParams } from '@/utils';
import { immer } from 'zustand/middleware/immer';
import { DailyMenuMeal, ReadDailyMenuResponse } from '@/api/daily-menus';
import { ReadMyOrderResponse } from '@/api/order';
import { ReadALaCardMenuResponse } from '@/api/alacard-menus';

export type MealType = 'MainCourse' | 'SideDish';

export interface Shift {
    id: string;
    shiftStartAt: string; // Format: 'HH:mm'
    shiftEndAt: string;   // Format: 'HH:mm'
    orderingDeadlineBeforeShiftStart: number; // Number of hours before start time for order deadline (for Regular shifts)
}

export interface ALaCarteShift {
    id: string;
    shiftStartAt: string; // Format: 'HH:mm'
    shiftEndAt: string;   // Format: 'HH:mm'
}

export type OrderItem = {
    skuId: string;
    name: string;
    price: number;
    productionPrice: number;
    quantity: number;
    imageUrl: string;
    type: MealType;
};

export interface OrderDetails {
    id: string;
    number: string;
    companyId: string;
    customerId: string;
    state: OrderState;
    type: OrderType;
    orderDate: DateIso;
    orderItems: OrderItem[];
    placedAt?: DateTimeIsoUtc;
    confirmedAt?: DateTimeIsoUtc;
}

export interface CartStore {
    companyCode?: string;
    activeDay: DateIso; // ISO date string
    activeShift?: Shift | ALaCarteShift;
    activeMenus?: ReadDailyMenuResponse[];
    activeALaCarteMenus?: ReadALaCardMenuResponse[];
    regularShifts: Shift[];
    aLaCarteShift?: ALaCarteShift;
    immediateOrders: ReadMyOrderResponse[];
    scheduledOrders: ReadMyOrderResponse[];
    selectedOrder?: OrderDetails;

    // State management actions
    setActiveDay: (day: DateIso) => void;
    setActiveShift: (shiftId: string) => void;
    setSelectedOrderById: (orderId: string) => void;
    setMenus: (menu: ReadDailyMenuResponse, aLaCarteMenu?: ReadDailyMenuResponse) => void;
    addOrder: (order: OrderDetails) => void;
    updateOrder: (orderId: string, orderItems: OrderItem[]) => void;
    cancelOrder: (orderId: string) => void;
    confirmOrder: (orderId: string) => void;
    resetCart: () => void;

    // API integration placeholders
    fetchShifts: () => Promise<void>;
    fetchMenus: (day: string) => Promise<void>;
    fetchImmediateOrders: (day: DateIso) => Promise<void>;
    fetchScheduledOrders: (day: DateIso) => Promise<void>;
    loadCartData: (companyCode: string) => Promise<void>;
}

const api = {
    fetchRegularShifts: (companyCode: string) => {
        return axiosPrivate.get(`/companies/${companyCode}/shifts`);
    },

    fetchALaCarteShift: (companyCode: string) => {
        return axiosPrivate.get(`/companies/${companyCode}/a-la-card-shifts`);
    },

    fetchDailyMenu: (from: string, to: string) => {
        return axiosPrivate.get(`/daily-menus?${createUrlParams({ From: from, To: to })}`);
    },

    fetchALaCarteMenu: (from: string, to: string) => {
        return axiosPrivate.get(`/alacard-menus?${createUrlParams({ From: from, To: to })}`);
    },

    fetchImmediateOrders: (companyCode: string, date: DateIso) => {
        return axiosPrivate.get(`/companies/${companyCode}/orders/me?${createBaseUrlQuery({
            filter: { fromDate: date, toDate: date, orderTypes: ['Immediate'] },
        })}`);
    },

    fetchScheduledOrders: (companyCode: string, date: DateIso) => {
        return axiosPrivate.get(`/companies/${companyCode}/orders/me?${createBaseUrlQuery({
            filter: { fromDate: date, toDate: date, orderTypes: ['Scheduled'] },
        })}`);
    },

    addOrderItem: (companyCode: string, orderId: string, skuId: string) => {
        return axiosPrivate.post(
            `/companies/${companyCode}/orders/${orderId}/items/${skuId}/add`
        );
    },

    decreaseOrderItemQuantity: (
        companyCode: string,
        orderId: string,
        skuId: string
    ) => {
        return axiosPrivate.patch(
            `/companies/${companyCode}/orders/${orderId}/items/${skuId}/decrease-quantity`
        );
    },

    cancelOrder: (companyCode: string, orderId: string) => {
        return axiosPrivate.delete(
            `/companies/${companyCode}/orders/${orderId}`
        );
    },

    confirmImmediateOrder: (
        companyCode: string,
        orderId: string,
        data: any
    ) => {
        return axiosPrivate.post(
            `/companies/${companyCode}/orders/${orderId}/immediate/status/confirm`,
            data
        );
    },

    createScheduledOrder: (companyCode: string, data: any) => {
        return axiosPrivate.post(
            `/companies/${companyCode}/orders/scheduled`,
            data
        );
    },
};

export const useCartStore = create<CartStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                companyCode: undefined,
                activeDay: new Date().toISOString().split('T')[0] as DateIso,
                regularShifts: [],
                immediateOrders: [],
                scheduledOrders: [],

                setActiveDay: async (day: DateIso) => {
                    set(state => {
                        state.activeDay = day;
                    });
                    await get().fetchMenus(day);
                    await Promise.all([get().fetchImmediateOrders(day), get().fetchScheduledOrders(day)]);
                },

                setActiveShift: async (shiftId: string) => {
                    const shift = get().regularShifts.find(s => s.id === shiftId) || get().aLaCarteShift;
                    if (shift) {
                        set(state => {
                            state.activeShift = shift;
                        });
                        const activeDay = get().activeDay;
                        await get().fetchMenus(activeDay);
                    }
                },

                setSelectedOrderById: (orderId: string) => {
                    const immediateOrder = get().immediateOrders.find(order => order.id === orderId);
                    const scheduledOrder = get().scheduledOrders.find(order => order.id === orderId);
                    set(state => {
                        state.selectedOrder = immediateOrder || scheduledOrder;
                    });
                },

                setMenus: (menu: ReadDailyMenuResponse, aLaCarteMenu?: ReadDailyMenuResponse) => {
                    set(state => {
                        state.activeMenus = menu;
                        if (aLaCarteMenu) {
                            state.activeALaCarteMenus = aLaCarteMenu;
                        }
                    });
                },

                addOrder: async (order: OrderDetails) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        set(state => {
                            state.scheduledOrders.push(order as ReadMyOrderResponse);
                        });
                        await api.createScheduledOrder(companyCode, order);
                    }
                },

                updateOrder: async (orderId: string, orderItems: OrderItem[]) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const orderType = get().selectedOrder?.type === 'Immediate' ? 'immediateOrders' : 'scheduledOrders';
                        set(state => {
                            const orderIndex = state[orderType].findIndex(order => order.id === orderId);
                            if (orderIndex !== -1) {
                                state[orderType][orderIndex].orderItems = orderItems.map(meal => ({
                                    skuId: meal.skuId,
                                    name: meal.name,
                                    price: meal.price,
                                    productionPrice: meal.price, // assuming production price is same as meal price
                                    quantity: meal.quantity,
                                    imageUrl: meal.imageUrl,
                                    type: meal.type
                                }));
                                state[orderType][orderIndex].updatedAt = new Date().toISOString() as DateTimeIsoUtc;
                            }
                        });
                        await api.addOrderItem(companyCode, orderId, orderItems[0].id);
                    }
                },

                cancelOrder: async (orderId: string) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const orderType = get().selectedOrder?.type === 'Immediate' ? 'immediateOrders' : 'scheduledOrders';
                        set(state => {
                            const orderIndex = state[orderType].findIndex(order => order.id === orderId);
                            if (orderIndex !== -1) {
                                state[orderType][orderIndex].state = 'Canceled';
                                state[orderType][orderIndex].updatedAt = new Date().toISOString() as DateTimeIsoUtc;
                            }
                        });
                        await api.cancelOrder(companyCode, orderId);
                    }
                },

                confirmOrder: async (orderId: string) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const orderType = get().selectedOrder?.type === 'Immediate' ? 'immediateOrders' : 'scheduledOrders';
                        set(state => {
                            const orderIndex = state[orderType].findIndex(order => order.id === orderId);
                            if (orderIndex !== -1) {
                                state[orderType][orderIndex].state = 'Confirmed';
                                state[orderType][orderIndex].updatedAt = new Date().toISOString() as DateTimeIsoUtc;
                            }
                        });
                        await api.confirmImmediateOrder(companyCode, orderId, {});
                    }
                },

                resetCart: () => {
                    set(state => {
                        state.activeShift = undefined;
                        state.activeMenus = undefined;
                        state.activeALaCarteMenus = undefined;
                        state.immediateOrders = [];
                        state.scheduledOrders = [];
                        state.selectedOrder = undefined;
                    });
                },

                fetchShifts: async () => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const [regularShifts, aLaCarteShift] = await Promise.all([
                            api.fetchRegularShifts(companyCode),
                            api.fetchALaCarteShift(companyCode),
                        ]);
                        set(state => {
                            state.regularShifts = regularShifts;
                            state.aLaCarteShift = aLaCarteShift;
                        });
                    }
                },

                fetchMenus: async (day: string) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const [dailyMenuList, aLaCarteMenuList] = await Promise.all([
                            api.fetchDailyMenu(day, day),
                            api.fetchALaCarteMenu(day, day),
                        ]);
                        set(state => {
                            state.activeMenus = dailyMenuList;
                            state.activeALaCarteMenus = aLaCarteMenuList;
                        });
                    }
                },

                fetchImmediateOrders: async (day: DateIso) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const orders = await api.fetchImmediateOrders(companyCode, day);
                        set(state => {
                            state.immediateOrders = orders;
                        });
                    }
                },

                fetchScheduledOrders: async (day: DateIso) => {
                    const companyCode = get().companyCode;
                    if (companyCode) {
                        const orders = await api.fetchScheduledOrders(companyCode, day);
                        set(state => {
                            state.scheduledOrders = orders;
                        });
                    }
                },

                loadCartData: async (companyCode: string) => {
                    set(state => {
                        state.companyCode = companyCode;
                    });

                    const [regularShiftsResponse, aLaCarteShiftResponse, dailyMenuResponseTodayList, dailyMenuResponseTomorrow, aLaCarteMenuResponse] = await Promise.all([
                        api.fetchRegularShifts(companyCode),
                        api.fetchALaCarteShift(companyCode),
                        api.fetchDailyMenu(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]),
                        api.fetchDailyMenu(new Date(Date.now() + 86400000).toISOString().split('T')[0], new Date(Date.now() + 86400000).toISOString().split('T')[0]),
                        api.fetchALaCarteMenu(new Date().toISOString().split('T')[0], new Date(Date.now() + 86400000).toISOString().split('T')[0]),
                    ]);

                    set(state => {
                        state.regularShifts = regularShiftsResponse;
                        state.aLaCarteShift = aLaCarteShiftResponse;
                        state.activeMenus = dailyMenuResponseTodayList;
                        state.activeALaCarteMenus = aLaCarteMenuResponse;
                    });

                    const [scheduledOrdersResponse, immediateOrdersResponse] = await Promise.all([
                        api.fetchScheduledOrders(companyCode, new Date().toISOString().split('T')[0] as DateIso),
                        api.fetchImmediateOrders(companyCode, new Date().toISOString().split('T')[0] as DateIso),
                    ]);

                    set(state => {
                        state.scheduledOrders = scheduledOrdersResponse;
                        state.immediateOrders = immediateOrdersResponse;
                    });
                },
            })),
            {
                name: 'cart-store', // Storage key
            }
        )
    )
);
