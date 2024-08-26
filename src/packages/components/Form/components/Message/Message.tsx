import clsx from 'clsx'
import { HTMLAttributes } from 'react'

interface MessageProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Message = ({ children, className }: MessageProps) => (
    <p
        className={clsx([
            'text-red message absolute inset-y-0 translate-y-full whitespace-nowrap text-xs italic leading-5',
            className
        ])}>
        {children}
    </p>
)
