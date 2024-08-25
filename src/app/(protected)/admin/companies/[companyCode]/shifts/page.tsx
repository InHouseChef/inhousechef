'use client'

import { Header } from "@/components"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { ShiftList } from "./components/ShiftList/ShiftList"

export default function Shifts({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params
    const router = useRouter()

    return (
        <>
            <Header heading='Shifts'>
                <Button type='button' onClick={() => router.push(`/admin/companies/${companyCode}/shifts/create`)}>
                    Create Shift
                </Button>
            </Header>
            <ShiftList params={params} />
        </>
    )
}
