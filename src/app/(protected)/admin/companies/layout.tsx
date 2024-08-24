'use client'

import { TopNav } from '@/components'
import { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <TopNav />
            {children}
        </>
    )
}
