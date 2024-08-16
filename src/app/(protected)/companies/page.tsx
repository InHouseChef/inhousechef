'use client'

import { Header } from '@/components'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { CompanyList } from './components/CompanyList/CompanyList'

export default function Companies() {
    const router = useRouter()

    return (
        <>
            <Header heading='Companies'>
                <Button type='button' onClick={() => router.push('/companies/create')}>
                    Create Company
                </Button>
            </Header>
            <CompanyList />
        </>
    )
}
