import { ReadDailyMenuResponse } from '@/api/daily-menus'
import { ReadShiftResponse } from '@/api/shifts'
import { DateIso } from '@/types'
import { addDaysToDate, toDateFromDateIso, toDateIso, toTimeFromString } from '@/utils/date'

export const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sr-Latn-RS', { weekday: 'short' }).toUpperCase()
}

export const calculateDateRange = (today: DateIso, numberOfDays: number) => {
    const formattedToday = toDateFromDateIso(today)
    const toDate = addDaysToDate(numberOfDays - 1, formattedToday)

    return {
        from: toDateIso(formattedToday),
        to: toDateIso(new Date(toDate))
    }
}

export interface UpcomingDailyMenuDate {
    day: string
    name: string
    date: DateIso
    available: boolean
    disabled: boolean
}

export const generateUpcomingDates = (today: DateIso, dailyMenus?: ReadDailyMenuResponse[]) => {
    const formattedToday = toDateFromDateIso(today)
    const upcomingDates: UpcomingDailyMenuDate[] = []

    const totalDays = 10

    for (let i = 0; i < totalDays; i++) {
        const futureDate = addDaysToDate(i, formattedToday)

        const dayName = getDayName(futureDate)
        const isAvailable = dailyMenus?.some(({ date }) => date === futureDate) || false
        const isDisabled = !isAvailable

        upcomingDates.push({
            day: futureDate.slice(-2),
            name: dayName,
            date: futureDate,
            available: isAvailable,
            disabled: isDisabled
        })
    }

    return upcomingDates
}

export const isShiftActive = (shift: ReadShiftResponse, currentDateTime: Date) => {
    const shiftStart = toTimeFromString(shift.shiftStartAt)
    const shiftEnd = toTimeFromString(shift.shiftEndAt)
    return currentDateTime >= shiftStart && currentDateTime <= shiftEnd
}

export const getActiveShift = (shifts: ReadShiftResponse[], currentDateTime: Date) => {
    return shifts?.find(shift => isShiftActive(shift, currentDateTime))
}

export const sortShiftsByStartAt = (shifts?: ReadShiftResponse[]) =>
    shifts?.sort((a, b) => toTimeFromString(a.shiftStartAt).getTime() - toTimeFromString(b.shiftStartAt).getTime())
