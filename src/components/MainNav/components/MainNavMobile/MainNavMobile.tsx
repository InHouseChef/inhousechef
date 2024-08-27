'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetFooter, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { useLogout } from '@/hooks'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MealCard } from '@/app/(protected)/employee/companies/[companyCode]/components/CompanyOrderForm/components/MealCard/MealCard'
import { ChevronLeft, UsersIcon } from 'lucide-react'
import { ChevronRight } from '@/packages/icons'
import { MainNavLink } from '../../types'
import { DailyMenuMeal, ReadDailyMenuResponse, useReadDailyMenus } from '@/api/daily-menus'
import { calculateDateRange } from '@/app/(protected)/employee/companies/[companyCode]/utils'
import { MealType } from '@/api/meals'
import { formatDateSerbianLatin } from '@/utils/date'

interface MainNavMobileProps {
    isNavOpen: boolean
    onOverlayClick: VoidFunction
}

const sampleMeals = [
    {
        id: '1',
        name: 'Grilled Chicken with Vegetables',
        description: 'Tender grilled chicken served with seasonal vegetables.',
        price: 10.99,
        type: 'Main Course',
        imageUrl: '/images/chicken.jpg'
    },
    {
        id: '2',
        name: 'Beef Steak with Mashed Potatoes',
        description: 'Juicy beef steak with creamy mashed potatoes.',
        price: 15.99,
        type: 'Main Course',
        imageUrl: '/images/steak.jpg'
    },
    {
        id: '3',
        name: 'Vegetarian Pasta',
        description: 'Pasta with fresh tomatoes, basil, and olive oil.',
        price: 8.99,
        type: 'Main Course',
        imageUrl: '/images/pasta.jpg'
    }
]

const sampleOrders = {
    ongoing: [
        {
            id: '1',
            orderNumber: '123456',
            name: 'Grilled Chicken with Vegetables',
            description: 'Tender grilled chicken served with seasonal vegetables.',
            price: 10.99,
            type: 'Main Course',
            imageUrl: '/images/chicken.jpg',
            date: '2021-10-10',
            status: 'In Progress'
        },
        {
            id: '2',
            orderNumber: '123456',
            name: 'Beef Steak with Mashed Potatoes',
            description: 'Juicy beef steak with creamy mashed potatoes.',
            price: 15.99,
            type: 'Main Course',
            imageUrl: '/images/steak.jpg',
            date: '2021-10-10',
            status: 'In Progress'
        },
        {
            id: '3',
            orderNumber: '123456',
            name: 'Vegetarian Pasta',
            description: 'Pasta with fresh tomatoes, basil, and olive oil.',
            price: 8.99,
            type: 'Main Course',
            imageUrl: '/images/pasta.jpg',
            date: '2021-10-10',
            status: 'In Progress'
        }
    ],
    history: [
        {
            id: '1',
            orderNumber: '123456',
            name: 'Grilled Chicken with Vegetables',
            description: 'Tender grilled chicken served with seasonal vegetables.',
            price: 10.99,
            type: 'Main Course',
            imageUrl: '/images/chicken.jpg',
            date: '2021-10-10',
            status: 'Completed'
        },
        {
            id: '2',
            orderNumber: '123456',
            name: 'Beef Steak with Mashed Potatoes',
            description: 'Juicy beef steak with creamy mashed potatoes.',
            price: 15.99,
            type: 'Main Course',
            imageUrl: '/images/steak.jpg',
            date: '2021-10-10',
            status: 'Completed'
        },
        {
            id: '3',
            orderNumber: '123456',
            name: 'Vegetarian Pasta',
            description: 'Pasta with fresh tomatoes, basil, and olive oil.',
            price: 8.99,
            type: 'Main Course',
            imageUrl: '/images/pasta.jpg',
            date: '2021-10-10',
            status: 'Completed'
        }
    ],
}

const OrderPage = () => {
    const [activeTab, setActiveTab] = useState('ongoing')

    return (
        <div>

            {/* Tabs */}
            <div className="mt-4 flex justify-around border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('ongoing')}
                    className={`py-2 w-1/2 text-center ${activeTab === 'ongoing' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
                >
                    Ongoing
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-2 w-1/2 text-center ${activeTab === 'history' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
                >
                    History
                </button>
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === 'ongoing' && (
                    <div>
                        {sampleOrders.ongoing.map(order => (
                            <div key={order.id} className="p-4 mb-4 bg-white rounded-lg shadow">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img src={order.imageUrl} alt={order.name} className="w-12 h-12 mr-4 rounded-md object-cover" />
                                        <div>
                                            <p className="font-semibold">{order.name}</p>
                                            <p className="text-gray-500">{order.price} | {order.type}</p>
                                            <p className="text-sm text-gray-500">{order.description}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">{order.orderNumber}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <button className="bg-primary text-white px-4 py-2 rounded">Track Order</button>
                                    <button className="border border-primary text-primary px-4 py-2 rounded">Cancel</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        {sampleOrders.history.map(order => (
                            <div key={order.id} className="p-4 mb-4 bg-white rounded-lg shadow">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img src={order.imageUrl} alt={order.name} className="w-12 h-12 mr-4 rounded-md object-cover" />
                                        <div>
                                            <p className="font-semibold">{order.name}</p>
                                            <p className="text-gray-500">{order.price} | {order.type}</p>
                                            <p className="text-sm text-gray-500">{order.description}</p>
                                            <p className="text-gray-500 text-sm">{order.date}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-semibold ${order.status === 'Completed' ? 'text-green-500' : order.status === 'Canceled' ? 'text-red-500' : ''}`}>
                                        {order.status}
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <button className="border border-primary text-primary px-4 py-2 rounded">Rate</button>
                                    <button className="bg-primary text-white px-4 py-2 rounded">Re-Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export const MenuPage = ({ dailyMenus }: { dailyMenus: ReadDailyMenuResponse[] }) => (
    <div className='mx-4 mt-4'>
        {dailyMenus.map((dailyMenu: ReadDailyMenuResponse) => (
            <div key={dailyMenu.date} className="mb-6">
                <h2 className="text-xl font-semibold">{formatDateSerbianLatin(new Date(dailyMenu.date))}</h2>
                <div className="grid grid-cols-1 gap-6 mt-4">
                    {dailyMenu.meals.filter(meal => meal.type === MealType.MainCourse).map((meal: DailyMenuMeal) => (
                        <MealCard key={meal.id} id={meal.id} name={meal.name} price={meal.price} imageUrl={meal.imageUrl} small={true} />
                    ))}
                </div>
            </div>
        ))}
    </div>
)

const sampleUsers = [
    { id: '1', name: 'John Doe', username: 'johndoe' },
    { id: '2', name: 'Jane Smith', username: 'janesmith' },
    { id: '3', name: 'Mike Johnson', username: 'mikejohnson' }
]

export const UsersPage = () => (
    <div className='mx-4 mt-4'>
        <table className='min-w-full border-collapse'>
            <thead>
                <tr>
                    <th className='border-b-2 border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                        Name
                    </th>
                    <th className='border-b-2 border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                        Username
                    </th>
                </tr>
            </thead>
            <tbody>
                {sampleUsers.map(user => (
                    <tr key={user.id}>
                        <td className='border-b border-gray-200 px-4 py-2 text-sm text-gray-700'>{user.name}</td>
                        <td className='border-b border-gray-200 px-4 py-2 text-sm text-gray-700'>{user.username}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

export interface CloseSectionProps {
    close: () => void;
    heading: string;
}

export const CloseSection = ({ close, heading }: CloseSectionProps) => {
    return (
        <SheetClose asChild>
            <button onClick={close} className="mb-4 text-right text-black">
                <div className="flex flex-start gap-4">
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    <div className='flex items-center justify-center'>
                        <p className="text-xl font-semibold">{heading}</p>
                    </div>
                </div>
            </button>
        </SheetClose>
    )
}

export const LogoutIcon = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="white"/>
            <path d="M23.0041 16.4947V15.7886C23.0041 14.2486 21.7907 13 20.2942 13H16.7092C15.2134 13 14 14.2486 14 15.7886V24.2114C14 25.7514 15.2134 27 16.7092 27H20.3016C21.7937 27 23.0041 25.7551 23.0041 24.2197V23.5061" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M27.0004 20H18.1455" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24.8467 17.7939L26.9999 19.9999L24.8467 22.2066" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export const ProfileIcon = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19.5" fill="white" stroke="white"/>
            <path d="M26 27V25.3333C26 24.4493 25.6839 23.6014 25.1213 22.9763C24.5587 22.3512 23.7956 22 23 22H17C16.2044 22 15.4413 22.3512 14.8787 22.9763C14.3161 23.6014 14 24.4493 14 25.3333V27" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 19C21.6569 19 23 17.6569 23 16C23 14.3431 21.6569 13 20 13C18.3431 13 17 14.3431 17 16C17 17.6569 18.3431 19 20 19Z" stroke="#7c3aed" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export const MenuIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 96 96">
            <path stroke="#7c3aed" stroke-width="4" d="M21 28C21 24.6863 23.6863 22 27 22H69C72.3137 22 75 24.6863 75 28V80C75 83.3137 72.3137 86 69 86H27C23.6863 86 21 83.3137 21 80V28Z"></path>
            <path stroke="#7c3aed" stroke-width="4" d="M21 74V27.2656C21 24.7117 22.6167 22.4377 25.0289 21.5987L59.0289 9.77257C62.9279 8.41638 67 11.3114 67 15.4395V21.5"></path>
            <path stroke="#7c3aed" stroke-linecap="round" stroke-width="4" d="M48 37C40.6043 37 34.548 42.7346 34.0352 49.9999 33.9963 50.5508 34.4477 51 35 51L61 51C61.5523 51 62.0037 50.5508 61.9648 49.9999 61.452 42.7347 55.3957 37 48 37zM48 33L48 35M31 51H65M32 64H54M32 72H48M56 72H65"></path>
        </svg>
    )
}

export const UserGroupIcon = () => {
    return(
        <UsersIcon color='#7c3aed' height={18} width={18} />
    )
}

const MEAL_RELATED_LINKS: MainNavLink[] = [
    {
        label: 'Moje porudžbine',
        path: 'my-orders',
        icon: <ProfileIcon />
    },
    {
        label: '7-dnevni jelovnik',
        path: 'menu',
        icon: <MenuIcon />
    },
]

const USER_RELATED_LINKS: MainNavLink[] = [
    {
        label: 'Moj profil',
        path: 'profile',
        icon: <ProfileIcon />
    },
    {
        label: 'Upravljanje korisnicima',
        path: 'users',
        icon: <UserGroupIcon />
    }
]

export const MainNavMobile = ({ isNavOpen, onOverlayClick }: MainNavMobileProps) => {
    const logout = useLogout()
    const {from, to} = calculateDateRange(new Date().toISOString(), 7)
    const { data: dailyMenus } = useReadDailyMenus({
        path: '',
        query: {
            filter: { from: from, to: to }
        }
    })

    // State to track which sub-drawer is open
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null)

    const openDrawer = (drawerId: string) => {
         setActiveDrawer(drawerId)
    }

    const closeDrawer = () => {
        setActiveDrawer(null)
    }

    return (
        <Sheet open={isNavOpen} onOpenChange={onOverlayClick}>
            <SheetTrigger asChild>
                <div
                    onClick={onOverlayClick}
                    className={clsx(
                        'absolute inset-0 top-[var(--topnav-height)] z-30 bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-300 lg:hidden',
                        {
                            'pointer-events-none opacity-0': !isNavOpen,
                            'pointer-events-auto opacity-100': isNavOpen
                        }
                    )}
                ></div>
            </SheetTrigger>
            <SheetContent side="right" className="px-6 py-8 lg:hidden flex flex-col h-full">
                <div className="flex-grow">
                    {/* <MainNavMobileUser /> */}
                    <div className="flex flex-col">
                        <div className='flex justify-left mb-6'>
                            <CloseSection close={onOverlayClick} heading='Menu' />
                        </div>
                        <div className='flex flex-col flex-start gap-8'>
                            <ul className="bg-gray-100 p-4 rounded-lg">
                                {MEAL_RELATED_LINKS.map(({ path, label, icon }) => (
                                    <li
                                        className="flex items-center gap-4 py-3 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-lg"
                                        onClick={() => openDrawer(path)}
                                        key={path}
                                    >
                                        <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                                            {icon}
                                        </div>
                                        <span className="text-lg font-medium text-gray-700">
                                            {label}
                                        </span>
                                        <ChevronRight className="ml-auto text-gray-400" />
                                    </li>
                                ))}
                            </ul>
                            <ul className="bg-gray-100 p-4 mt-4 rounded-lg">
                                {USER_RELATED_LINKS.map(({ path, label, icon }) => (
                                    <li
                                        className="flex items-center gap-4 py-3 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-lg"
                                        onClick={() => openDrawer(path)}
                                        key={path}
                                    >
                                        <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                                            {/* Replace with your icon component */}
                                            {icon}
                                        </div>
                                        <span className="text-lg font-medium text-gray-700">
                                            {label}
                                        </span>
                                        <ChevronRight className="ml-auto text-gray-400" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <SheetFooter className="mt-auto">
                <Button
                    onClick={logout}
                    className="flex items-center gap-4 py-10 px-4 bg-gray-100 w-full rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                >
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-full">
                        {/* Replace with your logout icon component */}
                        <LogoutIcon />
                    </div>

                    <div className="text-lg font-medium text-center text-gray-700">
                        Log Out
                    </div>
                    <ChevronRight className="ml-auto text-gray-400" />
                </Button>

                </SheetFooter>
            </SheetContent>

            <Sheet open={activeDrawer === 'my-orders'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 lg:hidden flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='Moje porudžbine' />
                    <div className="flex-grow">
                        <OrderPage />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'menu'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 lg:hidden flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='7-dnevni jelovnik' />
                    <div className="flex-grow overflow-y-auto">
                        <MenuPage dailyMenus={dailyMenus} />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'users'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-6 py-8 lg:hidden flex flex-col h-full">
                    <CloseSection close={closeDrawer} heading='Upravljanje korisnicima' />
                    <div className="flex-grow">
                        <UsersPage />
                    </div>
                </SheetContent>
            </Sheet>
        </Sheet>
    )
}
