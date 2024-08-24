'use client'

import { RequireCompanyAuthorization } from '@/components'
import { ReactNode } from 'react'

import AdminCompanyLayout from './[companyCode]/(admin)/layouts/AdminCompanyLayout'
import ClientCompanyLayout from './[companyCode]/(client)/layouts/ClientCompanyLayout'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <RequireCompanyAuthorization role='Admin'>
                <AdminCompanyLayout>{children}</AdminCompanyLayout>
            </RequireCompanyAuthorization>
            <RequireCompanyAuthorization role='Employee'>
                <ClientCompanyLayout>{children}</ClientCompanyLayout>
            </RequireCompanyAuthorization>
        </>
    )
}
