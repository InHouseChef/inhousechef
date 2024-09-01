'use client'

import { TopNav } from '@/components'
import { ReactNode } from 'react'
import { ClientProtectedLayout } from '../layouts/ProtectedLayout'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <ClientProtectedLayout>
            <div className='flex flex-grow flex-col overflow-x-clip'>
                <TopNav />
                {children}
            </div>
        </ClientProtectedLayout>
    )
}
