'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetFooter, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { useBaseUrl, useLogout, usePathParams } from '@/hooks'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { CLIENT_COMPANY_LINKS } from '../../constants'
import { MainNavMobileUser } from './components/MainNavMobileUser'
import { Button } from '@/components/ui/button'
import { MealCard } from '@/app/(protected)/employee/companies/[companyCode]/components/CompanyOrderForm/components/MealCard/MealCard'
import { ChevronLeft, User, User2Icon, UserCircle, UserCircle2, UserCircle2Icon, UserCircleIcon } from 'lucide-react'
import { useReadMeals } from '@/api/meals'
import { date } from 'zod'

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
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Orders</h2>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex justify-around border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('ongoing')}
                    className={`py-2 w-1/2 text-center ${activeTab === 'ongoing' ? 'border-b-2 border-orange-500 text-orange-500 font-semibold' : 'text-gray-500'}`}
                >
                    Ongoing
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-2 w-1/2 text-center ${activeTab === 'history' ? 'border-b-2 border-orange-500 text-orange-500 font-semibold' : 'text-gray-500'}`}
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
                                    <button className="bg-orange-500 text-white px-4 py-2 rounded">Track Order</button>
                                    <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded">Cancel</button>
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
                                    <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded">Rate</button>
                                    <button className="bg-orange-500 text-white px-4 py-2 rounded">Re-Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export const MenuPage = () => (
    <div className='mx-4 mt-4 grid grid-cols-1 gap-6'>
        {sampleMeals.map(meal => (
            <MealCard key={meal.id} {...meal} />
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

export const MainNavMobile = ({ isNavOpen, onOverlayClick }: MainNavMobileProps) => {
    const logout = useLogout()
    const router = useRouter()

    // State to track which sub-drawer is open
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null)

    const openDrawer = (drawerId: string) => {
        console.log('Opening drawer:', drawerId)
        setActiveDrawer(drawerId)
    }

    const closeDrawer = () => {
        setActiveDrawer(null)
    }

    return (
        <Sheet open={isNavOpen} onOpenChange={onOverlayClick}>
            <SheetTrigger asChild>
                {/* <div
                    onClick={onOverlayClick}
                    className={clsx(
                        'absolute inset-0 top-[var(--topnav-height)] z-30 bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-300 lg:hidden',
                        {
                            'pointer-events-none opacity-0': !isNavOpen,
                            'pointer-events-auto opacity-100': isNavOpen
                        }
                    )}
                ></div> */}
            </SheetTrigger>
            <SheetContent side="right" className="px-5 py-4 lg:hidden flex flex-col h-full">
                <div className="flex-grow">
                    {/* <MainNavMobileUser /> */}
                    <div className="flex flex-col">
                        <div className='flex justify-left mb-6'>
                            <UserCircleIcon className='w-12 h-12' stroke='#7c3aed'/>
                        </div>
                        <ul>
                            {CLIENT_COMPANY_LINKS.map(({ path, label }) => (
                                <li
                                    className='border-b flex items-center gap-3 py-2.5 text-lg font-medium transition-colors hover:text-black/80 text-black'
                                    onClick={() => openDrawer(path)}
                                    key={path}
                                >
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <SheetFooter className="mt-auto">
                    <Button
                        onClick={logout}
                        className="flex w-full items-center justify-center gap-5 rounded-md px-5 py-4 text-secondary transition-colors hover:bg-secondary/80 hover:text-white active:bg-secondary active:text-white"
                    >
                        Log Out
                    </Button>
                </SheetFooter>
            </SheetContent>

            <Sheet open={activeDrawer === 'my-orders'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-5 py-4 lg:hidden flex flex-col h-full">
                    <SheetClose asChild >
                        <button onClick={closeDrawer} className="mb-4 text-right text-black">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    </SheetClose>
                    <div className="flex-grow">
                        <OrderPage />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'menu'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-5 py-4 lg:hidden flex flex-col h-full">
                    <SheetClose asChild>
                        <button onClick={closeDrawer} className="mb-4 text-right text-black">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    </SheetClose>
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold mb-4">Menu</h2>
                        <MenuPage />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'users'} onOpenChange={closeDrawer}>
                <SheetContent side="right" className="px-5 py-4 lg:hidden flex flex-col h-full">
                    <SheetClose asChild>
                        <button onClick={closeDrawer} className="mb-4 text-right text-black">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    </SheetClose>
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold mb-4">Users</h2>
                        <UsersPage />
                    </div>
                </SheetContent>
            </Sheet>
        </Sheet>
    )
}
