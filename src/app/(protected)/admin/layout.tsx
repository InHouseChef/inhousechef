import { ReactNode } from 'react'
import { AdminProtectedLayout } from '../layouts/ProtectedLayout'
import { MainNavDesktopAdmin } from '@/components/MainNav'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <AdminProtectedLayout>
            <div className='flex h-full w-full'>
                <MainNavDesktopAdmin />
                <div className='flex w-full flex-grow flex-col'>
                    <div className='flex-grow overflow-y-auto px-6 pb-4'>{children}</div>
                </div>
            </div>
        </AdminProtectedLayout>
    )
}
