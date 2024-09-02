'use client'
import { Main, RequireCompanyAuthorization } from '@/components'
import { ReactNode } from 'react'

interface ClientProtectedLayoutProps {
    children?: ReactNode
}

export const ClientProtectedLayout = ({ children }: ClientProtectedLayoutProps) => {
    return (
        <>
            <RequireCompanyAuthorization role='Employee'>
                <div className='flex h-full w-full flex-grow flex-col'>
                    <Main>{children}</Main>
                </div>
            </RequireCompanyAuthorization>
            <RequireCompanyAuthorization role='CompanyManager'>
                <div className='flex h-full w-full flex-grow flex-col'>
                    <Main>{children}</Main>
                </div>
            </RequireCompanyAuthorization>
        </>
    )
}
