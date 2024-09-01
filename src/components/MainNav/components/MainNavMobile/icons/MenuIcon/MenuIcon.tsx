import { SVGProps } from 'react'

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' fill='none' viewBox='0 0 96 96' {...props}>
            <path
                stroke='currentColor'
                strokeWidth='4'
                d='M21 28C21 24.6863 23.6863 22 27 22H69C72.3137 22 75 24.6863 75 28V80C75 83.3137 72.3137 86 69 86H27C23.6863 86 21 83.3137 21 80V28Z'></path>
            <path
                stroke='currentColor'
                strokeWidth='4'
                d='M21 74V27.2656C21 24.7117 22.6167 22.4377 25.0289 21.5987L59.0289 9.77257C62.9279 8.41638 67 11.3114 67 15.4395V21.5'></path>
            <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='4'
                d='M48 37C40.6043 37 34.548 42.7346 34.0352 49.9999 33.9963 50.5508 34.4477 51 35 51L61 51C61.5523 51 62.0037 50.5508 61.9648 49.9999 61.452 42.7347 55.3957 37 48 37zM48 33L48 35M31 51H65M32 64H54M32 72H48M56 72H65'></path>
        </svg>
    )
}
