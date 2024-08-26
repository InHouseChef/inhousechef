'use client'

import { usePathParams } from '@/hooks'
import { ALaCardShiftUpdateForm } from './components/ALaCardShiftUpdateForm/ALaCardShiftUpdateForm'

export default function ShiftPage() {
    const { companyCode } = usePathParams<{ companyCode: string }>()

    return (
        <>
            <ALaCardShiftUpdateForm companyCode={companyCode} />
        </>
    )
}
