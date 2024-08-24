'use client'

import { Header, RequireCompanyAuthorization } from '@/components'
import { useRouter } from 'next/navigation'
import { Button } from 'react-day-picker'
import { CompanyList } from '../components/CompanyList/CompanyList'
import { CompanyBrandingColorsUpdateForm } from './(admin)/components/Branding/Colors/CompanyBrandingColorsUpdateForm'
import { CompanyBrandingLogoUpdateForm } from './(admin)/components/Branding/Logo/CompanyBrandingLogoUpdateForm'
import { DangerZone } from './(admin)/components/DangerZone/DangerZoneForm'
import { CompanyDetailsUpdateForm } from './(admin)/components/Details/CompanyDetailsUpdateForm'
import { CompanyOrderForm } from './(client)/components/CompanyOrderForm/CompanyOrderForm'

export default function CompanyPage({ params }: { params: { companyCode: string } }) {
    const { companyCode } = params
    const router = useRouter()

    return (
        <>
            <RequireCompanyAuthorization role='Employee'>
                <CompanyOrderForm />
            </RequireCompanyAuthorization>
            <RequireCompanyAuthorization role='Admin'>
                <Header heading='Companies'>
                    <Button type='button' onClick={() => router.push('/companies/create')}>
                        Create Company
                    </Button>
                </Header>
                <CompanyList />
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
            </RequireCompanyAuthorization>
        </>
    )
}
