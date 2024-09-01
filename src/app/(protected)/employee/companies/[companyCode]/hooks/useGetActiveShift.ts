import { ReadShiftResponse } from '@/apis/shifts'
import { useAppDate } from '@/hooks'
import { getActiveShift } from '../utils'

export const useActiveShift = (shifts: ReadShiftResponse[]) => {
    const { getAppDateTime } = useAppDate()
    const currentDateTime = getAppDateTime()
    return getActiveShift(shifts, currentDateTime)
}
