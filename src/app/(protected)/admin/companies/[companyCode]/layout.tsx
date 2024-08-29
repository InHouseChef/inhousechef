'use client'

import { ReactNode } from 'react'
import { COMPANY_LINKS } from './constants'
import { useParams } from 'next/navigation'
import { MainTopNav } from '@/components/MainNav'
import { MainNavLink } from '@/components/MainNav/types'
import { usePathParams } from '@/hooks'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { companyCode } = usePathParams<{ companyCode: string }>()
    const links = COMPANY_LINKS.map(({ path, label }) => ({ path: `/admin/companies/${companyCode}${path}`, label })) as MainNavLink[]

    return (
        <>
            <MainTopNav links={links} />
            {children}
        </>
    )
}
