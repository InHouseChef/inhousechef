import { MealType } from '@/api/meals'
import { OrderState } from '@/types'

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
    MainCourse: 'Glavna jela',
    SideDish: 'Prilozi'
}

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
    Placed: 'Poručeno',
    Cancelled: 'Otkazano',
    Draft: 'Započeto',
    Confirmed: 'Potvrđeno'
}
