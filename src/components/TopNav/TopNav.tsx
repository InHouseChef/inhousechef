'use client'
import { useDialogControl } from '@/hooks'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MainNavMobile } from '../MainNav'
import { TopNavHamburger } from './components/TopNavHamburger'
import { TopNavLogo } from './components/TopNavLogo'
import { TopNavLogout } from './components/TopNavLogout'
import { TopNavUser } from './components/TopNavUser'

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
                    'z-50 flex min-h-[var(--topnav-height)] items-center justify-end border-b bg-white px-6 transition-colors lg:border-grey700/50',
                    {
                        'border-grey700/0': isOpen,
                        'border-grey700/50': !isOpen
                    }
                )}>
                <TopNavLogo />
                <div className='flex items-center gap-2 lg:gap-4'>
                    <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />
                    <TopNavUser isNavOpen={isOpen} />
                    <TopNavLogout />
                </div>
            </div>
            <MainNavMobile isNavOpen={isOpen} onOverlayClick={handleClose} />
        </>
    )
}
