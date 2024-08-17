'use client'

import { MainTopNav } from '@/components/MainNav'
import { usePathParams } from '@/hooks'
import { ReactNode } from 'react'
import { COMPANY_LINKS } from '../constants'

interface CompanyLayoutProps {
    children?: ReactNode
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
    const { companyCode } = usePathParams<{ companyCode: string }>()

    const links = COMPANY_LINKS.map(({ path, label }) => ({ path: `/companies/${companyCode}${path}`, label }))

    return (
        <>
            <MainTopNav links={links} />
            {children}
        </>
    )
}
