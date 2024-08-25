'use client'
import { Main, RequireCompanyAuthorization } from '@/components'
import { ReactNode } from 'react'

interface AdminProtectedLayoutProps {
    children?: ReactNode
}

export const AdminProtectedLayout = ({ children }: AdminProtectedLayoutProps) => {
    return (
        
            <RequireCompanyAuthorization role='Admin'>
                <div className='flex w-full h-full flex-grow flex-col'>
                    <Main>{children}</Main>
                </div>
            </RequireCompanyAuthorization>
        
    )
}
