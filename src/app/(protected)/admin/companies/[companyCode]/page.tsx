'use client'

import { CompanyBrandingColorsUpdateForm } from './components/Branding/Colors/CompanyBrandingColorsUpdateForm'
import { CompanyBrandingLogoUpdateForm } from './components/Branding/Logo/CompanyBrandingLogoUpdateForm'
import { DangerZone } from './components/DangerZone/DangerZoneForm'
import { CompanyDetailsUpdateForm } from './components/Details/CompanyDetailsUpdateForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

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
