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
                'lg:hidden relative w-8 h-8 transform transition-transform duration-300 cursor-pointer translate-x-0',
                {
                    'translate-x-14': isNavOpen
                }
            )}>
            <span
                className={clsx(
                    'block absolute bg-[#160042] rounded-lg opacity-100 transform transition-all duration-300',
                    'left-1 h-0.5 w-6',
                    { 'rotate-45 top-[15px] left-[4px]': isNavOpen, 'top-[7px]': !isNavOpen }
                )}
            />
            <span
                className={clsx(
                    'block absolute bg-[#160042] rounded-lg transition-all duration-300',
                    'left-1 h-0.5 w-6 top-[15px]',
                    { 'w-0 opacity-0': isNavOpen }
                )}
            />
            <span
                className={clsx(
                    'block absolute bg-[#160042] rounded-lg opacity-100 transform transition-all duration-300',
                    'left-1 h-0.5 w-6',
                    { '-rotate-45 top-[15px] left-[4px]': isNavOpen, 'top-[23px]': !isNavOpen }
                )}
            />
        </button>
    )
}
