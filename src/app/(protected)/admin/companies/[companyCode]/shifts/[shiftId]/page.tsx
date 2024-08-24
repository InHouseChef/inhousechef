'use client'

import { usePathParams } from "@/hooks"
import { ShiftUpdateForm } from "./components/ShiftUpdateForm/ShiftUpdateForm"

export default function ShiftPage() {
    const { companyCode, shiftId } = usePathParams<{ companyCode: string, shiftId: string }>()

    return (
        <>
            <ShiftUpdateForm companyCode={companyCode} shiftId={shiftId} />
        </>
    )
}