import { Time } from '@/types'

interface Shift {
    name: string
    shiftStartAt: Time
    shiftEndAt: Time
    orderingDeadlineBeforeShiftStart: string
}

export interface ReadShiftResponse extends Shift {
    id: string
    companyId: string
}

export interface CreateShiftRequest extends Shift {}

export interface CreateShiftResponse extends Shift {
    id: string
    companyId: string
}
