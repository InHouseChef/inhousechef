'use client'

import { MainNavDesktop, MainTopNav } from '@/components/MainNav'
import { usePathParams } from '@/hooks'
import { ReactNode } from 'react'
import { COMPANY_LINKS } from '../constants'

interface AdminCompanyLayoutProps {
    children?: ReactNode
}

export default function AdminCompanyLayout({ children }: AdminCompanyLayoutProps) {
    const { companyCode } = usePathParams<{ companyCode: string }>()

    const links = COMPANY_LINKS.map(({ path, label }) => ({ path: `/companies/${companyCode}${path}`, label }))

    return (
        <>
            <MainTopNav links={links} />
            <MainNavDesktop />

            {children}
        </>
    )
}
