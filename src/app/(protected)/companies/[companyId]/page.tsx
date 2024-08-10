'use client'

import { usePathParams } from '@/hooks'
import { CompanyUpdateForm } from './components/CompanyUpdateForm/CompanyUpdateForm'

export default function CompanyPage() {
    const { companyId } = usePathParams<{ companyId: string }>()

    return <CompanyUpdateForm companyId={companyId} />
}
