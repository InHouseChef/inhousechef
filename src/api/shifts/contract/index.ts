import { Time } from '@/types'

interface Shift {
    name: string
    shiftStartAt: Time
    shiftEndAt: Time
    orderingDeadlineBeforeShiftStart: number
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

export interface ALaCarteShift {
    id: string
    shiftStartAt: Time
    shiftEndAt: Time
}

