import { useWindowResize } from '@/hooks'
import { RefObject, useState } from 'react'

type BreakpointRelationOperator = 'Greater' | 'GreaterOrEqual' | 'Equal' | 'SmallerOrEqual' | 'Smaller'

const RELATION_OPERATOR_FUNCTIONS: Record<BreakpointRelationOperator, (a: number, b: number) => Boolean> = {
    Greater: (a, b) => a > b,
    GreaterOrEqual: (a, b) => a >= b,
    Equal: (a, b) => a === b,
    Smaller: (a, b) => a < b,
    SmallerOrEqual: (a, b) => a <= b
}

type ElementDimensions = {
    height?: number
    width?: number
}

interface UseElementBreakpoint {
    element?: RefObject<HTMLElement>
    breakpoints: ElementDimensions
    relationOperator: BreakpointRelationOperator
}

export const useElementBreakpoint = ({
    element,
    breakpoints: { height, width },
    relationOperator
}: UseElementBreakpoint) => {
    const [elementSize, setElementSize] = useState(element?.current?.getBoundingClientRect())

    const updateElementSize = () => setElementSize(element?.current?.getBoundingClientRect())

    useWindowResize(updateElementSize)

    return {
        height: checkRelation({
            a: height,
            b: elementSize?.height,
            relationOperator
        }),
        width: checkRelation({
            a: width,
            b: elementSize?.width,
            relationOperator
        })
    }
}

interface CheckRelationParams {
    a?: number
    b?: number
    relationOperator: BreakpointRelationOperator
}

const checkRelation = ({ a, b, relationOperator }: CheckRelationParams) => {
    if (!a || !b) return
    return RELATION_OPERATOR_FUNCTIONS[relationOperator](a, b)
}
