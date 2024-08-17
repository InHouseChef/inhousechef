'use client'

import { CompanyUpdateForm } from './components/CompanyUpdateForm/CompanyUpdateForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    return (
        <>
            <CompanyUpdateForm companyCode={companyCode} />
        </>
    )
}
