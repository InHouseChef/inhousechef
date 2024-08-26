import { ReactNode } from 'react'
import { AdminProtectedLayout } from '../layouts/ProtectedLayout'
import { MainNavDesktop, TopNav } from '@/components'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <AdminProtectedLayout>
            <div className='flex h-full w-full'>
                {/* Left-side navigation, full height */}
                <MainNavDesktop />

                {/* Right-side content area */}
                <div className='flex w-full flex-grow flex-col'>
                    {/* Top navigation */}
                    <TopNav />

                    {/* Main content */}
                    <div className='flex-grow overflow-y-auto px-6 pb-4'>{children}</div>
                </div>
            </div>
        </AdminProtectedLayout>
    )
}
