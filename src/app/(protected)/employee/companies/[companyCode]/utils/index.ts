import { MealType } from '@/api/meals'
import { DateLocalIso, OrderState } from '@/types'
import { addDaysToDate, getToLocalISOString, toDateFromDateIsoLocal } from '@/utils/date'
import { MEAL_TYPE_LABELS, ORDER_STATE_LABELS } from '../constants'

export const calculateDateRange = (today: DateLocalIso, numberOfDays: number) => {
    const formattedToday = toDateFromDateIsoLocal(today)
    const toDate = addDaysToDate(numberOfDays - 1, formattedToday)

    return {
        from: getToLocalISOString(formattedToday),
        to: getToLocalISOString(new Date(toDate))
    }
}

export const getMealTypeLabel = (type: MealType) => MEAL_TYPE_LABELS[type]

export const getOrderStateLabel = (state: OrderState) => ORDER_STATE_LABELS[state]
