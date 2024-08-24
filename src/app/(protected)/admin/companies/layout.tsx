'use client'

import { MainTopNav } from '@/components/MainNav'
import { ReactNode } from 'react'
import { COMPANY_LINKS } from './[companyCode]/constants'
import { usePathParams } from '@/hooks'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { companyCode } = usePathParams<{ companyCode: string }>()

    const links = COMPANY_LINKS.map(({ path, label }) => ({ path: `/admin/companies/${companyCode}${path}`, label }))

    return (
        <>
            <MainTopNav links={links}/>
            {children}
        </>
    )
}
