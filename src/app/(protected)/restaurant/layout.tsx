import { ReactNode } from 'react'
import { RestaurantProtectedLayout } from '../layouts/ProtectedLayout'
import { MainNavDesktopRestaurant } from '@/components/MainNav'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <RestaurantProtectedLayout>
            <MainNavDesktopRestaurant />
            <div className='flex w-full flex-grow flex-col'>
                <div className='flex-grow overflow-y-auto pb-4'>{children}</div>
            </div>
        </RestaurantProtectedLayout>
    )
}
