import { Time } from '@/types'

interface ALaCardShift {
    name: string
    companyId: string
    shiftStartAt: Time
    shiftEndAt: Time
}

export interface ReadALaCardShiftResponse extends ALaCardShift {
    id: string
    companyId: string
}

export interface CreateALaCardShiftRequest {
    shiftStartAt: Time
    shiftEndAt: Time
}

export interface CreateALaCardShiftResponse extends ALaCardShift {
    id: string
    companyId: string
}
