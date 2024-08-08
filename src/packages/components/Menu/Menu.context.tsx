import { createSafeContext } from '@/packages/hooks'
import { Placement } from '@popperjs/core'
import { CSSProperties, Dispatch, RefObject, SetStateAction } from 'react'

interface MenuContext {
    ref: RefObject<HTMLDivElement>
    open: boolean
    openDropdown: VoidFunction
    closeDropdown: VoidFunction
    toggleDropdown: VoidFunction
    closeOnItemClick: boolean
    closeOnClickOutside: boolean
    useDefaultStyles: boolean
    isScrollable: boolean
    minWidth: number
    popper: {
        placement: Placement
        setReferenceElement: Dispatch<SetStateAction<HTMLDivElement | null>>
        setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>
        styles: Record<string, CSSProperties>
        attributes: Record<string, Record<string, string> | undefined>
    }
}

export const [MenuContextProvider, useMenuContext] = createSafeContext<MenuContext>()
