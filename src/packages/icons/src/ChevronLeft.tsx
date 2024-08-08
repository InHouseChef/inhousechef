import { SVGProps } from 'react'

export const ChevronLeft = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
            <path d='M15 6L9 12L15 18' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    )
}
