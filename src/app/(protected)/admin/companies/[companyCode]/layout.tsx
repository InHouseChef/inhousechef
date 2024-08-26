'use client'

import { ReactNode } from 'react'
import { COMPANY_LINKS } from './constants'
import { useParams } from 'next/navigation'
import { MainTopNav } from '@/components/MainNav'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { companyCode } = useParams()
    const links = COMPANY_LINKS.map(({ path, label }) => ({ path: `/admin/companies/${companyCode}${path}`, label }))

    return (
        <>
            <MainTopNav links={links} />
            {children}
        </>
    )
}
