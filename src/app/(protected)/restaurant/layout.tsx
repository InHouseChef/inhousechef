import { ReactNode } from 'react'
import { RestaurantProtectedLayout } from '../layouts/ProtectedLayout'
import { MainNavDesktopRestaurant } from '@/components/MainNav'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <RestaurantProtectedLayout>
            <div className='flex h-full w-full'>
                <MainNavDesktopRestaurant />
                <div className='flex w-full flex-grow flex-col'>
                    <div className='flex-grow overflow-y-auto px-6 pb-4'>{children}</div>
                </div>
            </div>
        </RestaurantProtectedLayout>
    )
}
