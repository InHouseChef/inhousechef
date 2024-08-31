import { SVGProps } from 'react'

export const CartIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none' {...props}>
            <path d='M39.5 20C39.5 30.7696 30.7696 39.5 20 39.5C9.23045 39.5 0.5 30.7696 0.5 20C0.5 9.23045 9.23045 0.5 20 0.5C30.7696 0.5 39.5 9.23045 39.5 20Z' />
            <path
                d='M15.3643 12L13 15.1525V26.186C13 26.6041 13.1661 27.005 13.4617 27.3006C13.7573 27.5962 14.1582 27.7623 14.5762 27.7623H25.6098C26.0279 27.7623 26.4288 27.5962 26.7244 27.3006C27.02 27.005 27.186 26.6041 27.186 26.186V15.1525L24.8217 12H15.3643Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M13 15.1523H27.186'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M23.2453 18.3047C23.2453 19.1408 22.9132 19.9426 22.322 20.5338C21.7308 21.125 20.929 21.4571 20.0929 21.4571C19.2568 21.4571 18.455 21.125 17.8638 20.5338C17.2726 19.9426 16.9404 19.1408 16.9404 18.3047'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    )
}
