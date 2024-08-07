'use client'
import { useBaseUrl, useLogout } from '@/hooks'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LINKS } from '../../constants'
import { MainNavMobileUser } from './components/MainNavMobileUser'

interface MainNavMobileProps {
    isNavOpen: boolean
    onOverlayClick: VoidFunction
}

export const MainNavMobile = ({ isNavOpen, onOverlayClick }: MainNavMobileProps) => {
    const { baseUrl } = useBaseUrl()

    const pathname = usePathname()
    const logout = useLogout()

    return (
        <>
            <div
                className={clsx(
                    'absolute left-0 top-[var(--topnav-height)] z-40 w-screen bg-white px-5 py-4 transition-transform duration-300 lg:hidden',
                    {
                        'translate-y-0': isNavOpen,
                        '-translate-y-full': !isNavOpen
                    }
                )}>
                <MainNavMobileUser />
                <div className='mt-2.5 flex flex-col'>
                    {LINKS.map(({ path, label }) => {
                        const href = `${baseUrl}/${path}`
                        const isCurrentPath = pathname.includes(path)
                        return (
                            <Link
                                className={clsx(
                                    'flex items-center gap-3 rounded-lg py-2.5 text-lg font-medium transition-colors hover:text-black/80',
                                    {
                                        'text-black': isCurrentPath,
                                        'text-secondary': !isCurrentPath
                                    }
                                )}
                                href={href}
                                key={href}>
                                {label}
                            </Link>
                        )
                    })}
                </div>
                <button
                    onClick={logout}
                    className='mt-16 flex w-full items-center justify-between gap-5 rounded-md bg-secondary/10 px-5 py-4 text-secondary transition-colors hover:bg-secondary/80 hover:text-white active:bg-secondary active:text-white'>
                    Log Out
                </button>
            </div>
            <div
                onClick={onOverlayClick}
                className={clsx(
                    'absolute inset-0 top-[var(--topnav-height)] z-30 bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-300 lg:hidden',
                    {
                        'pointer-events-none opacity-0': !isNavOpen,
                        'pointer-events-auto opacity-100': isNavOpen
                    }
                )}></div>
        </>
    )
}
