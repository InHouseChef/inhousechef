'use client'
import { useLogout } from '@/hooks'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LINKS } from '../../constants'
import { MainNavLogo } from '../MainNavLogo'
import { LogOutIcon } from 'lucide-react'

export const MainNavDesktopAdmin = () => {
    const pathName = usePathname()
    const logout = useLogout()

    return (
        <nav className='relative hidden min-h-dvh w-[--main-nav-desktop-width] min-w-[--main-nav-desktop-width] bg-[#3a2a46] lg:block'>
            <div className='relative z-1000 flex flex-col justify-between h-full'>
                <div>
                    <div className='flex flex-col px-4 py-4'>
                        <div className='flex border rounded-md justify-center items-center p-2 w-16 h-16'>
                            <MainNavLogo />
                        </div>
                    </div>
                    <div className='flex flex-col px-2'>
                        {LINKS.map(({ path, label }) => {
                            const isCurrentPath = pathName.includes(path)
                            const href = `/${path}`
                            return (
                                <Link
                                    className={clsx(
                                        'flex items-center gap-3 rounded-md p-3 transition-colors hover:text-white',
                                        {
                                            'bg-primary text-white': isCurrentPath,
                                            'text-white/70': !isCurrentPath
                                        }
                                    )}
                                    href={href}
                                    key={href}>
                                    {label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <div className='px-2 py-4'>
                    <button
                        onClick={logout}
                        className={clsx(
                            'flex items-center gap-3 rounded-md p-3 transition-colors hover:text-white',
                            'text-white/70'
                        )}
                    >
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                            <LogOutIcon className='text-primary' />
                        </div>
                        <div className='font-medium'>Odjavi se</div>
                    </button>
                </div>
            </div>
        </nav>
    )
}
