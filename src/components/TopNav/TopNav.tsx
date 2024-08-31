'use client'
import { useDialogControl } from '@/hooks'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MainNavMobile } from '../MainNav'
import { TopNavHamburger } from './components/TopNavHamburger'
import { TopNavLogo } from './components/TopNavLogo'

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
                    'border-grey700/50 z-50 flex min-h-[var(--topnav-height)] items-center justify-between border-b px-6 transition-colors',
                    {
                        'border-grey700/0': isOpen,
                        'border-grey700/50': !isOpen
                    }
                )}>
                <TopNavLogo />
                <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />
            </div>
            <MainNavMobile isNavOpen={isOpen} onOverlayClick={handleClose} />
        </>
    )
}
