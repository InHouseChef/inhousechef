import { createTime } from '@/utils/time'
import { canPlaceOrder, Shift, useShift } from './useShift'

export interface OrderingDate {
    date: Date
    shifts: Shift[]
}

export const useOrderingDate = (date: Date, shifts: Shift[]): OrderingDate => {
    return {
        date,
        shifts
    }
}

export const canOrderForDate = (orderingDate: OrderingDate, currentTime: Date): boolean => {
    return orderingDate.shifts.some(shift => canPlaceOrder(shift, currentTime))
}

export const useGenerateShifts = (forDate: Date): Shift[] => {
    const shiftOne = useShift('1', createTime(8, 0, 0), createTime(16, 0, 0), createTime(8, 0, 0), forDate)
    const shiftTwo = useShift('2', createTime(16, 0, 0), createTime(0, 0, 0), createTime(8, 0, 0), forDate)
    return [shiftOne, shiftTwo]
}
