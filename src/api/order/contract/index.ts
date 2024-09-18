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

export type OrderItem = {
    skuId: string
    name: string
    price: number
    productionPrice: number
    quantity: number
    imageUrl: string
    type: MealType
}

interface OrderDetails {
    id: string
    number: string
    companyId: string
    customerId: string
    state: OrderState
    type: OrderType
    orderDate: DateLocalIso
    orderItems: OrderItem[]
    created: DateTimeIsoUtc
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

export interface ReadOrderResponse extends OrderDetails {
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
