'use client'
import { usePopperElement } from '@/packages/hooks'
import { Placement } from '@popperjs/core'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { MenuContextProvider } from './Menu.context'
import { MenuDropdown, MenuDropdownComponent } from './components/MenuDropdown/MenuDropdown'
import { MenuItem, MenuItemComponent } from './components/MenuItem/MenuItem'
import { MenuTrigger, MenuTriggerComponent } from './components/MenuTrigger/MenuTrigger'
import { MenuTriggerChevron, MenuTriggerChevronComponent } from './components/MenuTriggerChevron/MenuTriggerChevron'

export interface MenuProps {
    children?: ReactNode
    open?: boolean
    closeOnItemClick?: boolean
    closeOnClickOutside?: boolean
    onChange?: (open: boolean) => void
    onOpen?: VoidFunction
    onClose?: VoidFunction
    placement?: Placement
    useDefaultStyles?: boolean
    isScrollable?: boolean
    minWidth?: number
}

type MenuCompositionType = {
    Trigger: MenuTriggerComponent
    TriggerChevron: MenuTriggerChevronComponent
    Dropdown: MenuDropdownComponent
    Item: MenuItemComponent
}

type MenuComponentType = FC<MenuProps> & MenuCompositionType

export const Menu: MenuComponentType = ({
    children,
    open = false,
    onOpen,
    onClose,
    onChange,
    closeOnItemClick = true,
    closeOnClickOutside = true,
    useDefaultStyles = true,
    placement = 'bottom-end',
    isScrollable = true,
    minWidth = 200,
    ...rest
}) => {
    const [_open, setOpen] = useState<boolean>(open)
    const ref = useRef<HTMLDivElement>(null)

    const openDropdown = () => {
        setOpen(true)
        onOpen?.()
    }

    const closeDropdown = () => {
        setOpen(false)
        onClose?.()
    }

    const toggleDropdown = () => {
        setOpen(!_open)
    }

    useEffect(() => onChange?.(_open), [_open])

    useEffect(() => (open ? openDropdown() : closeDropdown()), [open])

    const { setReferenceElement, setPopperElement, attributes, styles } = usePopperElement({
        placement,
        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
    })

    return (
        <MenuContextProvider
            value={{
                ref,
                open: _open,
                openDropdown,
                closeDropdown,
                toggleDropdown,
                closeOnItemClick,
                closeOnClickOutside,
                useDefaultStyles,
                isScrollable,
                minWidth,
                popper: {
                    placement,
                    setReferenceElement,
                    setPopperElement,
                    styles,
                    attributes
                }
            }}>
            <div className='relative' aria-expanded={_open ? 'true' : 'false'} ref={ref} {...rest}>
                {children}
            </div>
        </MenuContextProvider>
    )
}

Menu.displayName = 'Menu'
Menu.Trigger = MenuTrigger
Menu.TriggerChevron = MenuTriggerChevron
Menu.Dropdown = MenuDropdown
Menu.Item = MenuItem
