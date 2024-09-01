import { MealType } from '@/api/meals'
import { DateLocalIso, DateTimeIsoUtc, OrderState, OrderType } from '@/types'

interface Order {
    shiftId: string
    orderDate: DateLocalIso
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
    orderDate: DateLocalIso
    orderItems: {
        skuId: string
        name: string
        price: number
        productionPrice: number
        quantity: number
        imageUrl: string
        type: MealType
    }[]
    placedAt?: DateTimeIsoUtc
    confirmedAt?: DateTimeIsoUtc
}

interface ScheduledOrderDetails extends OrderDetails {
    orderedForShiftId: string
    number: string
}

interface ImmediateOrderDetails extends OrderDetails {
    number: string
}

export interface IncrementOrderItemQuantityResponse extends OrderDetails {}

export interface DecreaseOrderItemQuantityResponse extends OrderDetails {}

export interface ReadOrderResponse extends Order {
    id: string
    number: string
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
    number: string
    updatedAt: DateTimeIsoUtc
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
