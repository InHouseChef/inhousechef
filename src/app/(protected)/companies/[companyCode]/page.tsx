'use client'

import { CompanyDetailsUpdateForm } from './(admin)/components/Details/CompanyDetailsUpdateForm'
import { CompanyBrandingColorsUpdateForm } from './(admin)/components/Branding/Colors/CompanyBrandingColorsUpdateForm'
import { CompanyBrandingLogoUpdateForm } from './(admin)/components/Branding/Logo/CompanyBrandingLogoUpdateForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params

    // TODO: return different page based on role

    return (
        <>
            <div className="pb-4 border-b border-gray-300">
                <CompanyDetailsUpdateForm companyCode={companyCode} />
            </div>
            <div className="pb-4 border-b border-gray-300">
                <CompanyBrandingLogoUpdateForm companyCode={companyCode} />
            </div>
            <div className="pb-4">
                <CompanyBrandingColorsUpdateForm companyCode={companyCode} />
            </div>
        </>
    )
}
