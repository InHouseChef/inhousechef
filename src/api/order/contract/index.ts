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
    scheduledFor: {
        date: DateIso
        shiftId: string
    }
    meals: {
        skuId: string
        name: string
        price: number
        productionPrice: number
        quantity: number
    }[]
    confirmedAt?: DateTimeIsoUtc
}

export interface IncrementOrderItemResponse extends OrderDetails {}

export interface DecreaseOrderItemQuantityResponse extends OrderDetails {}

export interface ReadOrderResponse extends Order {
    id: string
}

export interface CreateOrderRequest extends Order {}
export interface CreateOrderResponse extends OrderDetails {}

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

export interface ReadMyOrderResponse extends OrderDetails {}

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
