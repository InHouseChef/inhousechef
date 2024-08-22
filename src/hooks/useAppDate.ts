import { APP_TIMEZONE } from '@/constants'
import { formatDateSerbianLatin, toDateIso } from '@/utils/date'

export const useAppDate = () => {
    const timeZoneId = APP_TIMEZONE

    const getAppDate = () => toDateIso(getAppDateTime())

    const getAppDateTime = () => new Date(new Date().toLocaleString('en-US', { timeZone: timeZoneId }))

    const getFormattedAppDate = () => formatDateSerbianLatin(getAppDateTime())

    return { getAppDate, getAppDateTime, getFormattedAppDate }
}
export default useAppDate
