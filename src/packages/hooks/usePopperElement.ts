import { BasePlacement, Placement } from '@popperjs/core'
import { useEffect, useState } from 'react'
import { Modifier, usePopper } from 'react-popper'

interface UsePopperElementProps {
    placement: Placement
    modifiers?: Modifier<any, object>[]
}

const basePlacements: BasePlacement[] = ['bottom', 'top', 'left', 'right']

export const usePopperElement = ({ placement, modifiers = [] }: UsePopperElementProps) => {
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)

    const [currentBasePlacement, setCurrentBasePlacement] = useState<BasePlacement | null>(null)

    const { styles, attributes, state } = usePopper(referenceElement, popperElement, {
        placement,
        modifiers: [{ name: 'arrow', options: { element: arrowElement, padding: 8 } }, ...modifiers]
    })

    useEffect(() => {
        basePlacements.forEach(basePlacement => {
            return state?.placement.includes(basePlacement) ? setCurrentBasePlacement(basePlacement) : undefined
        })
    }, [attributes])

    return {
        setReferenceElement,
        setPopperElement,
        setArrowElement,
        styles,
        attributes,
        currentBasePlacement
    }
}
