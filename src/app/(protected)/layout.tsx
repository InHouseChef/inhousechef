'use client'

import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { ReactNode } from 'react'
import { ClientProtectedLayout } from './layouts/ProtectedLayout'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    const { roles } = useRoles()

    if (roles.Employee === true || roles.CompanyManager === true) {
        return (
            <ClientProtectedLayout>
                <div className='flex flex-grow flex-col overflow-x-clip'>
                    {children}
                </div>
            </ClientProtectedLayout>
        )
    }

    return <>{children}</>
}
