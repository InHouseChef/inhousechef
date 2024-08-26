import { Portal } from '@/packages/components'
import { useOnClickOutside } from '@/packages/hooks'
import { Placement } from '@popperjs/core'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, useRef } from 'react'
import { useMenuContext } from '../../Menu.context'

export interface MenuDropdownProps {
    children?: ReactNode
}

const MENU_ANIMATION = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { type: 'just' }
}

export type MenuDropdownComponent = FC<MenuDropdownProps>

export const MenuDropdown: MenuDropdownComponent = ({ children, ...rest }) => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { open, popper, useDefaultStyles, ref, closeOnClickOutside, closeDropdown, isScrollable } = useMenuContext()

    const { setPopperElement, styles, attributes } = popper
    useOnClickOutside({ ref, onEvent: closeOnClickOutside ? closeDropdown : () => {}, exceptions: [dropdownRef] })

    const placement = attributes?.popper?.['data-popper-placement'] as Placement

    return (
        <Portal>
            <AnimatePresence>
                {open ? (
                    <motion.div
                        ref={setPopperElement}
                        style={{ ...styles.popper, zIndex: '100' }}
                        {...attributes.popper}
                        {...MENU_ANIMATION}
                        {...rest}>
                        <div ref={dropdownRef}>
                            {useDefaultStyles ? (
                                <div
                                    className={clsx(
                                        'border-grey700 flex flex-col gap-0.5 rounded-lg border bg-white p-2 shadow-[0_8px_16px_rgba(24,_34,_55,_0.1)]',
                                        {
                                            'max-h-[500px] overflow-y-auto': isScrollable,
                                            'rounded-tr-none': placement === 'bottom-end' || placement === 'left-start',
                                            'rounded-tl-none': placement === 'bottom-start' || placement === 'right-start',
                                            'rounded-br-none': placement === 'left-end' || placement === 'top-end',
                                            'rounded-bl-none': placement === 'right-end' || placement === 'top-start',
                                            'rounded-tl-none rounded-tr-none': placement === 'bottom',
                                            'rounded-br-none rounded-tr-none': placement === 'left',
                                            'rounded-bl-none rounded-tl-none': placement === 'right',
                                            'rounded-bl-none rounded-br-none': placement === 'top'
                                        }
                                    )}>
                                    {children}
                                </div>
                            ) : (
                                children
                            )}
                        </div>
                    </motion.div>
                ) : undefined}
            </AnimatePresence>
        </Portal>
    )
}

MenuDropdown.displayName = 'MenuDropdown'
