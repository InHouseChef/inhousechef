import { ReactNode } from 'react'
import { AdminProtectedLayout } from '../layouts/ProtectedLayout'
import { MainNavDesktop, TopNav } from '@/components'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <AdminProtectedLayout>
            <div className='flex flex-col flex-grow overflow-x-clip'>
                <TopNav />
                <div className='flex flex-row w-full'>
                    <MainNavDesktop />
                    <div className='w-full px-4'>
                        {children}
                    </div>
                </div>
            </div>
        </AdminProtectedLayout>
    )
}