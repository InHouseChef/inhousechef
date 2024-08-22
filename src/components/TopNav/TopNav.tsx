'use client'
import { useDialogControl } from '@/hooks'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MainNavMobile } from '../MainNav'
import { TopNavHamburger } from './components/TopNavHamburger'
import { TopNavLogout } from './components/TopNavLogout'

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
                    'lg:border-grey700/50 z-50 flex min-h-[var(--topnav-height)] items-center justify-between border-b px-6 transition-colors lg:justify-end',
                    {
                        'border-grey700/0': isOpen,
                        'border-grey700/50': !isOpen
                    }
                )}>
                <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />

                {/* <TopNavLogo /> */}
                <div className='flex items-center justify-end gap-2 lg:gap-4'>
                    <TopNavLogout />
                </div>
            </div>
            <MainNavMobile isNavOpen={isOpen} onOverlayClick={handleClose} />
        </>
    )
}
