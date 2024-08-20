'use client'

import { Header } from "@/components"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { CompanyUserList } from "./components/CompanyUserList/CompanyUserList"

export default function Users({ params }: { params: { companyCode: string } }) {
    const router = useRouter()

    return (
        <>
            <Header heading='Users'>
                <Button type='button' onClick={() => router.push(`users/create`)}>
                    Create User
                </Button>
            </Header>
            <CompanyUserList params={params} />
        </>
    )
}
