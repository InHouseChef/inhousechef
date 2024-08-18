'use client'

import { CompanyOrderForm } from './(client)/components/CompanyOrderForm/CompanyOrderForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    // TODO: return different page based on role

    return (
        <>
            <CompanyOrderForm />
            {/* <CompanyUpdateForm companyCode={companyCode} /> */}
        </>
    )
}
