'use client'
import { useDialogControl } from '@/hooks'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MainNavMobile } from '../MainNav'
import { TopNavHamburger } from './components/TopNavHamburger'
import { TopNavLogo } from './components/TopNavLogo'
import { DaySelectorDropdown } from '@/app/(protected)/companies/[companyCode]/components/NewCompanyOrderForm/DaySelector/DaySelectorDropdown'
import { ShoppingCartIcon } from 'lucide-react'
import { useCartStore } from '@/app/(protected)/newstate'

export const TopNav = () => {
    const { isOpen, setIsOpen, handleClose } = useDialogControl()
    const { selectedOrder, setIsOpen: setIsCartOpen } = useCartStore()
    const pathname = usePathname()

    useEffect(() => {
        if (!isOpen) return
        handleClose()
    }, [pathname])

    const handleToggle = () => setIsOpen(!isOpen)

    const handleOpenCart = () => {
        setIsCartOpen(true)
    }

    return (
        <>
            <div
                className={clsx(
                    'border-grey700/50 z-50 flex min-h-[var(--topnav-height)] items-center justify-between border-b px-4 transition-colors',
                    {
                        'border-grey700/0': isOpen,
                        'border-grey700/50': !isOpen
                    }
                )}
            >
                <div className='flex flex-row items-center justify-center gap-4'>
                    <TopNavLogo />
                    <DaySelectorDropdown />
                </div>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <div className='relative text-gray-700'>
                        <ShoppingCartIcon onClick={handleOpenCart} />
                        {selectedOrder && (
                            <div className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></div>
                        )}
                    </div>
                    <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />
                </div>
            </div>
            <MainNavMobile isNavOpen={isOpen} onOverlayClick={handleClose} />
        </>
    )
}
