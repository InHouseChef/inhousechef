'use client'

import { ReactNode } from 'react'

interface PublicLayoutProps {
    children?: ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
    return (
        <section className='w-full'>
            <div className='flex h-screen items-center justify-center'>{children}</div>
        </section>
    )
}
