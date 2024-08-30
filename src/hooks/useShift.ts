// hooks/useShift.ts
import { useMemo } from 'react'
import { Time, subtractTime, timeToDate } from '../utils/time'

export interface Shift {
    id: string
    startAt: Time
    endAt: Time
    deadlineBeforeStart: Time
    date: Date
    deadlineDate: Date
}

export const useShift = (id: string, startAt: Time, endAt: Time, deadlineBeforeStart: Time, date: Date): Shift => {
    const deadlineOffset = useMemo(() => subtractTime(startAt, deadlineBeforeStart), [startAt, deadlineBeforeStart])
    const deadlineDate = useMemo(() => timeToDate(deadlineOffset, date), [deadlineOffset, date])

    return {
        id,
        startAt,
        endAt,
        deadlineBeforeStart,
        date,
        deadlineDate
    }
}

export const canPlaceOrder = (shift: Shift, currentTime: Date): boolean => {
    return currentTime < shift.deadlineDate
}
