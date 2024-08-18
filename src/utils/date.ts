import { DEFAULT_DATE_TIME_FORMAT_OPTIONS } from '@/constants'
import {
    DEFAULT_DATE_FORMAT_OPTIONS,
    DEFAULT_DATE_PROPS,
    DEFAULT_TIME_FORMAT_OPTIONS,
    TIME_FORMAT
} from '@/packages/constants'
import { DateFormatProps, TimeFormatOptions } from '@/packages/types'
import { DateIso, DateTimeIsoUtc } from '@/types'

const toDateFromString = (date: string, options: Intl.DateTimeFormatOptions = DEFAULT_DATE_TIME_FORMAT_OPTIONS) =>
    new Date(getDateFormatter(options).format(new Date(date)))

export const toDateIso = (date?: Date): DateIso => {
    if (!date) return ''
    const locales = 'default'
    const year = date.toLocaleString(locales, { year: 'numeric' })
    const month = date.toLocaleString(locales, { month: '2-digit' })
    const day = date.toLocaleString(locales, { day: '2-digit' })
    return [year, month, day].join('-')
}

export const toDateFromDateIso = (date: DateIso, timeZone: string = 'UTC') => toDateFromString(date, { timeZone })

export const toDateFromDateTimeIsoUtc = (date: DateTimeIsoUtc, timeZone: string = 'UTC') =>
    toDateFromString(date, {
        timeZone,
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })

export const formatDateTime = (
    date: number | string | Date,
    dateProps?: DateFormatProps,
    timeProps?: TimeFormatOptions
): string => {
    const formattedDate = formatDate(date, dateProps).date
    const formattedTime = formatTime(date, timeProps)
    return `${formattedDate} ${formattedTime}`
}

const formatAppDate = (date: number | string | Date, timeZone?: string, dateProps?: DateFormatProps) =>
    formatDate(date, {
        ...(dateProps || DEFAULT_DATE_PROPS),
        options: { ...DEFAULT_DATE_PROPS.options, timeZone }
    }).date

export const formatAppDateTime = (
    date: number | string | Date,
    timeZone?: string,
    dateProps?: DateFormatProps,
    timeProps?: TimeFormatOptions
): string => {
    const formattedDate = formatAppDate(date, timeZone, dateProps)

    const formattedTime = formatTime(date, { ...timeProps, timeZone })
    return `${formattedDate} ${formattedTime}`
}

export const formatDateIso = (date?: DateIso, props?: DateFormatProps) =>
    date ? formatDate(toDateFromDateIso(date), props).date : ''

export const formatDate = (
    date: number | string | Date = new Date(),
    props?: DateFormatProps
): {
    date: string
    parts?: Intl.DateTimeFormatPartTypesRegistry
} => {
    const dateProps = props || {
        options: DEFAULT_DATE_FORMAT_OPTIONS,
        format: ['month', 'day', 'year'],
        separator: '/'
    }

    const { format, options, separator } = dateProps
    try {
        const parts = getDateFormatterParts(date, { ...DEFAULT_DATE_FORMAT_OPTIONS, ...options })
        return {
            date:
                format
                    ?.map((partType, index) => {
                        return parts[partType] + (index !== format.length - 1 ? `${separator}` : '')
                    })
                    .join('') || '',
            parts
        }
    } catch (error) {
        return {
            date: 'Invalid Date'
        }
    }
}

export const formatTime = (date: number | string | Date, options = DEFAULT_TIME_FORMAT_OPTIONS): string => {
    try {
        const parts = getDateFormatterParts(date, {
            ...DEFAULT_TIME_FORMAT_OPTIONS,
            ...options
        })

        const formattedTime = TIME_FORMAT.map((partType, index) => {
            const separator = index !== TIME_FORMAT.length - 1 ? ':' : ''
            return parts[partType] + separator
        }).join('')

        return `${formattedTime} ${parts.dayPeriod}`
    } catch (error) {
        return 'Invalid Date'
    }
}

export const isCurrentYearAndMonth = (date: DateIso | Date, today: DateIso) =>
    getMonth(date) === getMonth(today) && getYear(date) === getYear(today)

export const isDateTimeGreaterThan = <T extends Date | DateTimeIsoUtc | DateIso = Date>(firstDate: T, secondDate: T) => {
    const a = typeof firstDate === 'string' ? toDateFromString(firstDate) : firstDate
    const b = typeof secondDate === 'string' ? toDateFromString(secondDate) : secondDate
    return a > b
}

export const isDateTimeGreaterThanOrEqual = <T extends Date | DateTimeIsoUtc | DateIso = Date>(
    firstDate: T,
    secondDate: T
) => {
    const a = typeof firstDate === 'string' ? toDateFromString(firstDate) : firstDate
    const b = typeof secondDate === 'string' ? toDateFromString(secondDate) : secondDate

    return a >= b
}

export const isDateTimeEqual = <T extends Date | DateTimeIsoUtc | DateIso = Date>(firstDate: T, secondDate: T) => {
    const a = typeof firstDate === 'string' ? toDateFromString(firstDate) : (firstDate as Date)
    const b = typeof secondDate === 'string' ? toDateFromString(secondDate) : (secondDate as Date)

    return a.getTime() === b.getTime()
}

export const getEarlierDate = (first: Date, second: Date) => (isDateTimeGreaterThan(first, second) ? second : first)
export const getEarlierDateToIsoDate = (first: Date, second: Date) => toDateIso(getEarlierDate(first, second))

export const getLaterDate = (first: Date, second: Date) => (isDateTimeGreaterThan(first, second) ? first : second)
export const getLaterDateToIsoDate = (first: Date, second: Date) => toDateIso(getLaterDate(first, second))

export const addDaysToDate = (daysToAdd: number, date: Date = new Date()): DateIso => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + daysToAdd)
    return toDateIso(newDate)
}

export const subtractDaysFromDate = (daysToSubtract: number, date: Date = new Date()): DateIso => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - daysToSubtract)
    return toDateIso(newDate)
}

export const addMonthsToDateIso = (date: DateIso, monthsToAdd: number, timeZone: string = 'UTC'): DateIso => {
    const newDate = toDateFromDateIso(date, timeZone)
    newDate?.setMonth(newDate.getMonth() + monthsToAdd)
    return toDateIso(newDate)
}

export const getDaysPassed = (date?: DateIso, today: Date = new Date()) => {
    if (!date) return ''
    const millisecondsPerDay = 24 * 60 * 60 * 1000
    const timeDiff = today.getTime() - new Date(date).getTime()
    return Math.round(timeDiff / millisecondsPerDay)
}

const getDateFormatter = (options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', options)

export const getDateFormatterParts = (date: number | string | Date, options?: Intl.DateTimeFormatOptions) => {
    const parts = getDateFormatter(options).formatToParts(new Date(date))
    return parts.reduce(
        (obj, item) => ({
            ...obj,
            [item.type]: item.value
        }),
        {}
    ) as Intl.DateTimeFormatPartTypesRegistry
}

export const getMonthFirstDay = (date?: Date | DateIso) => {
    const month = date ? new Date(date) : new Date()
    month.setDate(1)
    return month
}

export const getMonth = (date?: Date | DateIso) => {
    const month = date ? new Date(date) : new Date()
    return month.toLocaleString('default', { month: 'long' })
}

export const getYear = (date?: Date | DateIso) => {
    const year = date ? new Date(date) : new Date()
    return year.toLocaleString('default', { year: 'numeric' })
}

export const getLastDayOfMonthDateTime = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
export const getLastDayOfMonthDate = (date: Date) => toDateIso(getLastDayOfMonthDateTime(date))
export const isLastDayInMonth = (date: Date) => getLastDayOfMonthDateTime(date).getDate() === date.getDate()