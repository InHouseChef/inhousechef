'use client'
import { Main, RequireCompanyAuthorization } from '@/components'
import { ReactNode } from 'react'

interface RestaurantProtectedLayoutProps {
    children?: ReactNode
}

export const RestaurantProtectedLayout = ({ children }: RestaurantProtectedLayoutProps) => {
    return (
        <RequireCompanyAuthorization role='RestaurantWorker'>
            <div className='flex h-full w-full flex-grow flex-col'>
                <Main>{children}</Main>
            </div>
        </RequireCompanyAuthorization>
    )
}
