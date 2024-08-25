'use client'

import { Header } from "@/components"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { UserList } from "./components/UserList/UserList"

export default function Users({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params
    const router = useRouter()

    return (
        <>
            <Header heading='Users'>
                <Button type='button' onClick={() => router.push(`/admin/companies/${companyCode}/users/create`)}>
                    Create User
                </Button>
            </Header>
            <UserList params={params} />
        </>
    )
}
