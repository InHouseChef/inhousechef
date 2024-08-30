import { ReadALaCardShiftResponse } from '@/api/alacard-shifts'
import { ReadDailyMenuResponse } from '@/api/daily-menus'
import { MealType } from '@/api/meals'
import { ReadShiftResponse } from '@/api/shifts'
import { DateIso } from '@/types'
import { addDaysToDate, toDateFromDateIso, toDateIso, toStringFromTime } from '@/utils/date'
import { MEAL_TYPE_LABELS } from '../constants'

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
    const shiftStart = toStringFromTime(shift.shiftStartAt)
    const shiftEnd = toStringFromTime(shift.shiftEndAt)
    return currentDateTime >= shiftStart && currentDateTime <= shiftEnd
}

export const getActiveShift = (shifts: ReadShiftResponse[], currentDateTime: Date) => {
    return shifts?.find(shift => isShiftActive(shift, currentDateTime))
}

export const sortShiftsByStartAt = (shifts?: ReadShiftResponse[]) =>
    shifts?.sort((a, b) => toStringFromTime(a.shiftStartAt).getTime() - toStringFromTime(b.shiftStartAt).getTime())

export const canScheduleOrder = (shift: ReadShiftResponse, date: Date) => {
    const { shiftStartAt, orderingDeadlineBeforeShiftStart } = shift
    const shiftStart = toStringFromTime(shiftStartAt)
    const currentTime = date.getTime()
    const deadlineTime = shiftStart.getTime() - orderingDeadlineBeforeShiftStart * 60 * 60 * 1000 // convert hours to milliseconds

    return currentTime < deadlineTime
}

export const canImmediatelyOrder = (shift: ReadALaCardShiftResponse, date: Date) => {
    const { shiftEndAt } = shift
    const shiftEnd = toStringFromTime(shiftEndAt)
    const currentTime = date.getTime()
    const endTimeMinusOneHourThirtyMinutes = shiftEnd.getTime() - 1.5 * 60 * 60 * 1000
    return currentTime < endTimeMinusOneHourThirtyMinutes
}

export const getMealTypeLabel = (type: MealType) => MEAL_TYPE_LABELS[type]

export class Time {
    private _hours: number
    private _minutes: number
    private _seconds: number

    constructor(hours: number = 0, minutes: number = 0, seconds: number = 0) {
        if (hours < 0 || hours > 23) {
            throw new Error('Invalid hours value')
        }

        if (minutes < 0 || minutes > 59) {
            throw new Error('Invalid minutes value')
        }

        if (seconds < 0 || seconds > 59) {
            throw new Error('Invalid seconds value')
        }

        this._hours = hours
        this._minutes = minutes
        this._seconds = seconds
    }

    public get hours(): number {
        return this._hours
    }

    public get minutes(): number {
        return this._minutes
    }

    public get seconds(): number {
        return this._seconds
    }

    public toString(): string {
        let hoursString = this._hours.toString().padStart(2, '0')
        let minutesString = this._minutes.toString().padStart(2, '0')
        let secondsString = this._seconds.toString().padStart(2, '0')

        return `${hoursString}:${minutesString}:${secondsString}`
    }
    public static fromString(timeString: string): Time {
        let timeArray = timeString.split(':')
        if (timeArray.length != 3) {
            throw new Error('Invalid time string format')
        }

        let hours = parseInt(timeArray[0])
        let minutes = parseInt(timeArray[1])
        let seconds = parseInt(timeArray[2])

        return new Time(hours, minutes, seconds)
    }

    subtract(other: Time): Time {
        let seconds = this._seconds - other.seconds
        let minutes = this._minutes - other.minutes
        let hours = this._hours - other.hours

        if (seconds < 0) {
            seconds += 60
            minutes--
        }
        if (minutes < 0) {
            minutes += 60
            hours--
        }
        if (hours < 0) {
            hours += 24
        }
        return new Time(hours, minutes, seconds)
    }

    toDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), this._hours, this._minutes, this._seconds)
    }
}
