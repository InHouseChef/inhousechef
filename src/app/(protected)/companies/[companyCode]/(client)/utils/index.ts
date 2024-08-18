import { ReadDailyMenuResponse } from '@/api/daily-menus'
import { addDaysToDate, formatAppDateTime } from '@/utils/date'

export const getDayName = (dateString: string, timeZone: string = 'UTC'): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sr-Latn-RS', { weekday: 'short', timeZone }).toUpperCase()
}

interface UpcomingDate {
    day: string
    name: string
    dateString: string
    available: boolean
    disabled: boolean
}

export const generateUpcomingDates = (today: Date, dailyMenus?: ReadDailyMenuResponse[]): UpcomingDate[] => {
    const belgradeTimeZone = 'Europe/Belgrade'
    const dayOfWeek = today.getDay()
    const upcomingDates: UpcomingDate[] = []

    const startDay = dayOfWeek === 0 ? 0 : dayOfWeek
    const endDay = dayOfWeek === 0 ? 7 : 7 - dayOfWeek

    const totalDays = dayOfWeek === 0 ? 8 : endDay + 1

    for (let i = 0; i < totalDays; i++) {
        const futureDate = addDaysToDate(i - startDay, today)
        const formattedDate = formatAppDateTime(new Date(futureDate), belgradeTimeZone)
        const dayName = getDayName(formattedDate, belgradeTimeZone)
        const isAvailable = i >= 0
        const isDisabled = isAvailable && !dailyMenus?.some(menu => menu.date === formattedDate)

        upcomingDates.push({
            day: futureDate.slice(-2),
            name: dayName,
            dateString: formattedDate,
            available: isAvailable,
            disabled: isDisabled
        })
    }

    return upcomingDates
}
