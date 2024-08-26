import clsx from 'clsx'
import { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react'
import { useMenuContext } from '../../Menu.context'

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
}

export type MenuItemComponent = FC<MenuItemProps>

export const MenuItem: MenuItemComponent = ({ children, onClick, active, ...rest }) => {
    const { closeDropdown, closeOnItemClick } = useMenuContext()

    const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
        onClick?.(event)
        closeOnItemClick && closeDropdown()
    }

    return (
        <button
            type='button'
            onClick={handleClick}
            className={clsx(
                'disabled:text-grey700 flex items-center gap-1 whitespace-nowrap rounded border-none bg-transparent p-1.5 text-sm leading-5 transition-colors',
                'hover:bg-primary hover:text-white disabled:pointer-events-none',
                '[&:disabled>svg]:text-grey700 [&>svg]:text-grey [&:hover>svg]:text-white [&>svg]:h-6 [&>svg]:w-6 [&>svg]:transition-colors',
                '[&:hover>a]:text-white',
                {
                    'text-primary': active,
                    'text-black': !active
                }
            )}
            // active={active}
            {...rest}>
            {children}
        </button>
    )
}

MenuItem.displayName = 'MenuItem'
