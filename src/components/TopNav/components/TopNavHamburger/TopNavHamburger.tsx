'use client'
import clsx from 'clsx'
interface TopNavHamburgerProps {
    isNavOpen: boolean
    onToggle: VoidFunction
}

export const TopNavHamburger = ({ isNavOpen, onToggle }: TopNavHamburgerProps) => {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                'relative h-8 w-8 translate-x-0 transform cursor-pointer transition-transform duration-300 lg:hidden',
                {
                    'translate-x-14': isNavOpen
                }
            )}>
            <span
                className={clsx(
                    'absolute block transform rounded-lg bg-[#160042] opacity-100 transition-all duration-300',
                    'left-1 h-0.5 w-6',
                    { 'left-[4px] top-[15px] rotate-45': isNavOpen, 'top-[7px]': !isNavOpen }
                )}
            />
            <span
                className={clsx(
                    'absolute block rounded-lg bg-[#160042] transition-all duration-300',
                    'left-1 top-[15px] h-0.5 w-6',
                    { 'w-0 opacity-0': isNavOpen }
                )}
            />
            <span
                className={clsx(
                    'absolute block transform rounded-lg bg-[#160042] opacity-100 transition-all duration-300',
                    'left-1 h-0.5 w-6',
                    { 'left-[4px] top-[15px] -rotate-45': isNavOpen, 'top-[23px]': !isNavOpen }
                )}
            />
        </button>
    )
}
