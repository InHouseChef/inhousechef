'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MainNavLink } from '../../types'

interface MainTopNavProps {
    links: MainNavLink[]
    isMultiRow?: boolean
}

export const MainTopNav = ({ links, isMultiRow }: MainTopNavProps) => {
    const currentPath = usePathname()

    return (
        <nav
            className={clsx(
                'topnav-horizontal mx-[-24px] h-12 min-h-12 w-[calc(100%+48px)] border-b border-gray-300 bg-white',
                {
                    'min-h-auto h-auto py-3': isMultiRow
                }
            )}>
            <ul className={clsx('flex h-full items-center gap-6 bg-white px-5', { 'flex-wrap gap-2': isMultiRow })}>
                {links.map(({ to, label }) => (
                    <li className={clsx('relative')} key={to}>
                        <Link
                            href={to}
                            className={clsx(
                                'relative block rounded-md px-2 py-1 text-sm font-medium leading-6 text-gray-600 no-underline hover:text-primary',
                                { 'bg-primary text-white hover:text-secondary': currentPath === to }
                            )}>
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default MainTopNav
