import { DateIso, DateTimeIsoUtc, OrderState, OrderType } from '@/types'

interface Order {
    shiftId: string
    orderDate: DateIso
    meals: {
        id: string
        quantity: number
    }[]
}

interface OrderDetails {
    id: string
    companyId: string
    customerId: string
    state: OrderState
    type: OrderType
    orderDate: DateIso
    orderItems: {
        skuId: string
        name: string
        price: number
        productionPrice: number
        quantity: number
        imageUrl: string
    }[]
    placedAt?: DateTimeIsoUtc
    confirmedAt?: DateTimeIsoUtc
}

interface ScheduledOrderDetails extends OrderDetails {
    orderedForShiftId: string
}

interface ImmediateOrderDetails extends OrderDetails {}

export interface IncrementOrderItemQuantityResponse extends OrderDetails {}

export interface DecreaseOrderItemQuantityResponse extends OrderDetails {}

export interface ReadOrderResponse extends Order {
    id: string
}

export interface CreateScheduledOrderRequest extends Order {}
export interface CreateScheduledOrderResponse extends ScheduledOrderDetails {}

export interface CreateImmediateOrderRequest extends Order {
    meals: {
        id: string
        quantity: number
    }[]
}
export interface CreateImmediateOrderResponse extends ImmediateOrderDetails {}

export interface PlaceOrderResponse extends OrderDetails {}

interface OrderResponse {
    orderItems: {
        name: string
        soldAtPrice: number
        quantity: number
    }[]
    orderId: string
    customerId: string
    placedAt: DateTimeIsoUtc
}

export interface ReadOrderResponse extends OrderResponse {}

export interface ReadMyOrderResponse extends OrderDetails {
    orderedForShiftId: string
}

export interface ReadOrderSummaryResponse {
    companyId: string
    summary: {
        skuId: string
        name: string
        soldAtPrice: number
        productionPrice: number
        quantity: number
    }[]
}
