'use client'

import { usePathParams } from '@/hooks'
import { CompanyUpdateForm } from './components/CompanyUpdateForm/CompanyUpdateForm'

export default function CompanyPage() {
    const { companyCode } = usePathParams<{ companyCode: string }>()

    return <CompanyUpdateForm companyCode={companyCode} />
}
