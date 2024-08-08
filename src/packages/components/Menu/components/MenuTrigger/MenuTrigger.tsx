import { FC, ReactNode } from 'react'
import { useMenuContext } from '../../Menu.context'

export interface MenuTriggerProps {
    children?: ReactNode
}

export type MenuTriggerComponent = FC<MenuTriggerProps>

export const MenuTrigger: MenuTriggerComponent = ({ children, ...rest }) => {
    const { toggleDropdown, useDefaultStyles, popper } = useMenuContext()

    return (
        <div ref={popper.setReferenceElement} onClick={toggleDropdown} {...rest}>
            {useDefaultStyles ? (
                <div className='gap flex cursor-pointer items-center text-sm transition-colors hover:text-primary [&>svg]:h-5 [&>svg]:w-5 '>
                    {children}
                </div>
            ) : (
                children
            )}
        </div>
    )
}

MenuTrigger.displayName = 'MenuTrigger'
