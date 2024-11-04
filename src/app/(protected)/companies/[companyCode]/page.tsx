'use client'

import { RequireCompanyAuthorization, TopNav } from '@/components'
import { NewCompanyOrderForm } from './components/NewCompanyOrderForm/NewCompanyOrderForm'

export default function CompanyPage() {
    return (
        <>
            <RequireCompanyAuthorization role='Employee'>
                <>
                    <TopNav />
                    <NewCompanyOrderForm />
                </>
            </RequireCompanyAuthorization>
            <RequireCompanyAuthorization role='CompanyManager'>
                <>
                    <TopNav />
                    <NewCompanyOrderForm />
                </>
            </RequireCompanyAuthorization>
        </>
    )
}
