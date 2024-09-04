'use client'
import { useDialogControl } from '@/hooks'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MainNavMobile } from '../MainNav'
import { TopNavHamburger } from './components/TopNavHamburger'
import { TopNavLogo } from './components/TopNavLogo'
import { DaySelectorDropdown } from '@/app/(protected)/employee/companies/[companyCode]/components/NewCompanyOrderForm/DaySelector/DaySelectorDropdown'

export const TopNav = () => {
    const { isOpen, setIsOpen, handleClose } = useDialogControl()
    const pathname = usePathname()

    useEffect(() => {
        if (!isOpen) return
        handleClose()
    }, [pathname])

    const handleToggle = () => setIsOpen(!isOpen)

    return (
        <>
            <div
                className={clsx(
                    'border-grey700/50 z-50 flex min-h-[var(--topnav-height)] items-center justify-between border-b px-4 transition-colors',
                    {
                        'border-grey700/0': isOpen,
                        'border-grey700/50': !isOpen
                    }
                )}>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <TopNavLogo />
                    <DaySelectorDropdown />
                </div>
                <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />
            </div>
            <MainNavMobile isNavOpen={isOpen} onOverlayClick={handleClose} />
        </>
    )
}
