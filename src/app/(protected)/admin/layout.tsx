import { ReactNode } from 'react'
import { AdminProtectedLayout } from '../layouts/ProtectedLayout'
import { MainNavDesktop } from '@/components'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <AdminProtectedLayout>
            <MainNavDesktop />
            <div className='w-full p-4 overflow-y-auto overflow-x-hidden'>
                {children}
            </div>
        </AdminProtectedLayout>
    )
}