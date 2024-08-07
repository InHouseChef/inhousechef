import clsx from 'clsx'
import { HTMLAttributes } from 'react'

interface MessageProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Message = ({ children, className }: MessageProps) => (
    <p
        className={clsx([
            'absolute inset-y-0 translate-y-full text-red text-xs leading-5 italic whitespace-nowrap message',
            className
        ])}>
        {children}
    </p>
)
