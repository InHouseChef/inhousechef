'use client'

import { useReadMyUser } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from '@/components/ui/sheet'
import { useLogout, usePathParams } from '@/hooks'
import { ChevronRight } from '@/packages/icons'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import clsx from 'clsx'
import { ChevronLeft, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { MainNavLink } from '../../types'
import { MenuPage } from './components/MenuPage/MenuPage'
import { MyOrdersPage } from './components/MyOrdersPage/MyOrdersPage'
import { MyProfilePage } from './components/MyProfilePage/MyProfilePage'
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage/TermsAndConditionsPage'
import { UsersPage } from './components/UsersPage/UsersPage'
import { CartIcon, LogoutIcon, MenuIcon, TermsAndConditionsIcon, UserGroupIcon, UserProfileIcon } from './icons'
import { RequireCompanyAuthorization } from '@/components/RequireAuthorization/RequireAuthorization'

interface MainNavMobileProps {
    isNavOpen: boolean
    onOverlayClick: VoidFunction
}

export const MEAL_RELATED_LINKS: MainNavLink[] = [
    {
        label: 'Moje porudžbine',
        path: 'my-orders',
        icon: <CartIcon className='text-primary' />
    },
    {
        label: '7-dnevni jelovnik',
        path: 'menu',
        icon: <MenuIcon className='text-primary' />
    }
]

export const USER_RELATED_LINKS: MainNavLink[] = [
    {
        label: 'Moj profil',
        path: 'profile',
        icon: <UserProfileIcon className='text-primary' />
    },
    {
        label: 'Upravljanje korisnicima',
        path: 'users',
        icon: <UserGroupIcon />
    }
]

export const TERMS_AND_CONDITIONS = [
    {
        label: 'Uslovi korišćenja',
        path: 'privacy-policy',
        icon: <TermsAndConditionsIcon className='text-primary' />
    }
]

export interface CloseSectionProps {
    close: () => void
    heading: string
}

export const CloseSection = ({ close, heading }: CloseSectionProps) => {
    return (
        <SheetClose asChild>
            <button onClick={close} className='mb-4 text-right text-gray-700'>
                <div className='flex-start flex gap-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200'>
                        <ChevronLeft className='h-5 w-5' />
                    </div>
                    <div className='flex items-center justify-center'>
                        <p className='text-xl font-semibold'>{heading}</p>
                    </div>
                </div>
            </button>
        </SheetClose>
    )
}

export const MainNavMobile = ({ isNavOpen, onOverlayClick }: MainNavMobileProps) => {
    const logout = useLogout()
    const { companyCode } = usePathParams<{ companyCode: string }>()
    const { data: user } = useReadMyUser({
        path: { companyCode }
    })
    const { roles } = useRoles()

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
                        'absolute inset-0 top-[var(--topnav-height)] z-30 bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-300',
                        {
                            'pointer-events-none opacity-0': !isNavOpen,
                            'pointer-events-auto opacity-100': isNavOpen
                        }
                    )}></div>
            </SheetTrigger>
            <SheetContent side='right' className='flex h-full flex-col px-6 py-8'>
                <div className='flex-grow'>
                    <div className='flex flex-col'>
                        <div className='justify-left mb-6 flex'>
                            <CloseSection close={onOverlayClick} heading='Menu' />
                        </div>
                        <div className='flex-start flex flex-col gap-8'>
                            <ul>
                                {MEAL_RELATED_LINKS.map(({ path, label, icon }, index) => (
                                    <li
                                        className={clsx(
                                            'flex cursor-pointer items-center gap-4 border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200',
                                            {
                                                'rounded-t-lg': index === 0,
                                                'rounded-b-lg': index === MEAL_RELATED_LINKS.length - 1
                                            }
                                        )}
                                        onClick={() => openDrawer(path)}
                                        key={path}>
                                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                                            {icon}
                                        </div>
                                        <span className='text-lg font-medium text-gray-700'>{label}</span>
                                        <ChevronRight className='ml-auto text-gray-400' />
                                    </li>
                                ))}
                            </ul>
                            <ul>
                                <li
                                    className={clsx(
                                        'flex cursor-pointer items-center gap-4 rounded-t-lg border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200',
                                        { '': roles.CompanyManager === true, 'rounded-b-lg': roles.CompanyManager === false }
                                    )}
                                    onClick={() => openDrawer('profile')}
                                    key={'profile'}>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                                        {/* Replace with your icon component */}
                                        {<UserIcon className='text-primary' />}
                                    </div>
                                    <span className='text-lg font-medium text-gray-700'>{'Moj profil'}</span>
                                    <ChevronRight className='ml-auto text-gray-400' />
                                </li>
                                <RequireCompanyAuthorization role='CompanyManager'>
                                    <li
                                        className={clsx(
                                            'flex cursor-pointer items-center gap-4 rounded-b-lg border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200'
                                        )}
                                        onClick={() => openDrawer('users')}
                                        key={'users'}>
                                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                                            {/* Replace with your icon component */}
                                            {<UserGroupIcon />}
                                        </div>
                                        <span className='text-lg font-medium text-gray-700'>
                                            {'Upravljanje korisnicima'}
                                        </span>
                                        <ChevronRight className='ml-auto text-gray-400' />
                                    </li>
                                </RequireCompanyAuthorization>
                            </ul>
                            <ul>
                                {TERMS_AND_CONDITIONS.map(({ path, label, icon }, index) => (
                                    <li
                                        className={clsx(
                                            'flex cursor-pointer items-center gap-4 border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200',
                                            {
                                                'rounded-t-lg': index === 0,
                                                'rounded-b-lg': index === TERMS_AND_CONDITIONS.length - 1
                                            }
                                        )}
                                        onClick={() => openDrawer(path)}
                                        key={path}>
                                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                                            {/* Replace with your icon component */}
                                            {icon}
                                        </div>
                                        <span className='text-lg font-medium text-gray-700'>{label}</span>
                                        <ChevronRight className='ml-auto text-gray-400' />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <SheetFooter className='mt-auto'>
                    <Button
                        onClick={logout}
                        className='flex w-full cursor-pointer items-center gap-4 rounded-lg bg-gray-100 px-4 py-10 transition-all hover:bg-gray-200'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                            {/* Replace with your logout icon component */}
                            <LogoutIcon className='text-primary' />
                        </div>

                        <div className='text-center text-lg font-medium text-gray-700'>Odjavi se</div>
                        <ChevronRight className='ml-auto text-gray-400' />
                    </Button>
                </SheetFooter>
            </SheetContent>

            <Sheet open={activeDrawer === 'my-orders'} onOpenChange={closeDrawer}>
                <SheetContent side='right' className='flex h-full flex-col px-6 py-8'>
                    <CloseSection close={closeDrawer} heading='Moje porudžbine' />
                    <div className='flex-grow overflow-y-auto p-1'>
                        <MyOrdersPage />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'profile'} onOpenChange={closeDrawer}>
                <SheetContent side='right' className='flex h-full flex-col px-6 py-8'>
                    <CloseSection close={closeDrawer} heading='Moj profil' />
                    <div className='flex-grow overflow-y-auto p-1'>
                        <MyProfilePage user={user} />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'menu'} onOpenChange={closeDrawer}>
                <SheetContent side='right' className='flex h-full flex-col px-6 py-8'>
                    <CloseSection close={closeDrawer} heading='7-dnevni jelovnik' />
                    <div className='flex-grow overflow-y-auto p-1'>
                        <MenuPage days={7} />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'users'} onOpenChange={closeDrawer}>
                <SheetContent side='right' className='flex h-full flex-col px-6 py-8'>
                    <CloseSection close={closeDrawer} heading='Upravljanje korisnicima' />
                    <div className='flex-grow overflow-y-hidden p-1'>
                        <UsersPage />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={activeDrawer === 'privacy-policy'} onOpenChange={closeDrawer}>
                <SheetContent side='right' className='flex h-full flex-col px-6 py-8'>
                    <CloseSection close={closeDrawer} heading='Uslovi korišćenja' />
                    <div className='flex-grow overflow-y-auto p-1'>
                        <TermsAndConditionsPage />
                    </div>
                </SheetContent>
            </Sheet>
        </Sheet>
    )
}
