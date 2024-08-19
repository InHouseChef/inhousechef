import { APP_TIMEZONE } from '@/constants'
import { toDateIso } from '@/utils/date'

export const useAppDate = () => {
    const timeZoneId = APP_TIMEZONE

    const getAppDate = () => toDateIso(getAppDateTime())

    const getAppDateTime = () => new Date(new Date().toLocaleString('en-US', { timeZone: timeZoneId }))

    return { getAppDate, getAppDateTime }
}
export default useAppDate
