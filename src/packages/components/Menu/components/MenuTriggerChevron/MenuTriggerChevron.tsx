import { ChevronDown } from '@/packages/icons'
import clsx from 'clsx'
import { FC } from 'react'

export interface MenuTriggerChevronProps {
    isOpen: boolean
    disabled?: boolean
}

export type MenuTriggerChevronComponent = FC<MenuTriggerChevronProps>

export const MenuTriggerChevron: MenuTriggerChevronComponent = ({ isOpen, disabled }) => (
    <ChevronDown
        height={20}
        width={20}
        className={clsx(
            'transition-transform duration-200',
            { 'rotate-180 text-primary': isOpen },
            { 'text-[#545f71]': disabled }
        )}
    />
)

MenuTriggerChevron.displayName = 'MenuTriggerChevron'
