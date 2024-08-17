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

    const links = COMPANY_LINKS.map(({ to, label }) => ({ to: `/companies/${companyCode}${to}`, label }))

    return (
        <>
            <MainTopNav links={links} />
            {children}
        </>
    )
}
