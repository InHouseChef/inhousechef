'use client'

import { CompanyBrandingColorsUpdateForm } from './(admin)/components/Branding/Colors/CompanyBrandingColorsUpdateForm'
import { CompanyBrandingLogoUpdateForm } from './(admin)/components/Branding/Logo/CompanyBrandingLogoUpdateForm'
import { DangerZone } from './(admin)/components/DangerZone/DangerZoneForm'
import { CompanyDetailsUpdateForm } from './(admin)/components/Details/CompanyDetailsUpdateForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    // TODO: return different page based on role

    return (
        <>
            <div className='border-b border-gray-300 pb-4'>
                <CompanyDetailsUpdateForm companyCode={companyCode} />
            </div>
            <div className='border-b border-gray-300 pb-4'>
                <CompanyBrandingLogoUpdateForm companyCode={companyCode} />
            </div>
            <div className='pb-4'>
                <CompanyBrandingColorsUpdateForm companyCode={companyCode} />
            </div>

            <DangerZone companyCode={companyCode} />

        </>
    )
}
