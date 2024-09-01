'use client'
import { useBaseUrl } from '@/hooks'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LINKS } from '../../constants'
import { MainNavLogo } from '../MainNavLogo'

export const MainNavDesktop = () => {
    const { baseUrl } = useBaseUrl()
    const pathName = usePathname()

    return (
        // TODO: figure out a color for the main nav
        <nav className='relative hidden min-h-dvh w-[--main-nav-desktop-width] min-w-[--main-nav-desktop-width] bg-[#3a2a46] lg:block'>
            <div className='absolute inset-0 z-0'>
                {/* <Image
                    className='pointer-events-none h-full w-full object-cover'
                    src={DesktopMenuBg}
                    alt='bg-shape'
                    priority
                /> */}
            </div>
            <div className='relative z-10'>
                <div className='mx-5 mt-5'>
                    <MainNavLogo />
                </div>
                <div className='mt-5 px-4'>
                    {LINKS.map(({ path, label }) => {
                        const isCurrentPath = pathName.includes(path)
                        const href = `/${path}`
                        return (
                            <Link
                                className={clsx(
                                    'flex items-center gap-3 rounded-lg p-3 transition-colors hover:text-white',
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
        </nav>
    )
}
