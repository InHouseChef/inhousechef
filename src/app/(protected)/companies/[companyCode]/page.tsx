'use client'

import { CompanyUpdateForm } from './(admin)/components/CompanyUpdateForm/CompanyUpdateForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    // TODO: return different page based on role

    return (
        <>
            <CompanyUpdateForm companyCode={companyCode} />
        </>
    )
}
