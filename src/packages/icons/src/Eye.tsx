import { SVGProps } from 'react'

export const Eye = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
            <g clipPath='url(#clip0_999_2412)'>
                <path
                    d='M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z'
                    fill='currentColor'
                    fillOpacity='0.2'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
                <path
                    d='M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </g>
            <defs>
                <clipPath id='clip0_999_2412'>
                    <rect width='24' height='24' fill='white' />
                </clipPath>
            </defs>
        </svg>
    )
}
