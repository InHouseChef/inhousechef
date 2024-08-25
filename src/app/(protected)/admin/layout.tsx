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
                <div className='flex flex-col flex-grow w-full'>
                    {/* Top navigation */}
                    <TopNav />

                    {/* Main content */}
                    <div className='flex-grow overflow-y-auto px-6 pb-4'>
                        {children}
                    </div>
                </div>
            </div>
        </AdminProtectedLayout>
    )
}
