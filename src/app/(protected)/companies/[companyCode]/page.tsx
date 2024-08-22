'use client'

import { CompanyOrderForm } from './(client)/components/CompanyOrderForm/CompanyOrderForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    // TODO: return different page based on role

    return (
        <>
            <CompanyOrderForm />

            {/* <div className='border-b border-gray-300 pb-4'>
                <CompanyDetailsUpdateForm companyCode={companyCode} />
            </div>
            <div className='border-b border-gray-300 pb-4'>
                <CompanyBrandingLogoUpdateForm companyCode={companyCode} />
            </div>
            <div className='pb-4'>
                <CompanyBrandingColorsUpdateForm companyCode={companyCode} />
            </div> */}
        </>
    )
}
