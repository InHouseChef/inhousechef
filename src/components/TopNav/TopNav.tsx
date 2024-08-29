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
                    'z-50 flex min-h-[var(--topnav-height)] items-center justify-end border-b border-grey700/50 px-6 transition-colors',
                    {
                        'border-grey700/0': isOpen,
                        'border-grey700/50': !isOpen
                    }
                )}
            >
                <div className="flex items-center justify-end gap-2">
                    {/* <TopNavLogout /> */}
                    <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />
                </div>

                <TopNavHamburger isNavOpen={isOpen} onToggle={handleToggle} />
            </div>
            <MainNavMobile isNavOpen={isOpen} onOverlayClick={handleClose} />
        </>
    )
}
