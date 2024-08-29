'use client'

import { RequireCompanyAuthorization } from '@/components'
import { CompanyOrderForm } from './components/CompanyOrderForm/CompanyOrderForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    return (
        <>
            <RequireCompanyAuthorization role='Employee'>
                <CompanyOrderForm />
            </RequireCompanyAuthorization>
            <RequireCompanyAuthorization role='CompanyManager'>
                <CompanyOrderForm />
            </RequireCompanyAuthorization>
        </>
    )
}
