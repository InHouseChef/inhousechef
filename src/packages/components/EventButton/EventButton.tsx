import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Spinner } from '../Spinner'

interface EventButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
}

export const EventButton = forwardRef<HTMLButtonElement, EventButtonProps>(
    ({ children, type = 'button', isLoading, className, ...rest }, ref) => (
        <button
            className={`disabled:text-grey800 flex h-max items-center gap-1 rounded border-0 bg-transparent p-0 text-black transition-colors duration-200 hover:text-primary ${className}`}
            type={type}
            ref={ref}
            {...rest}>
            {isLoading ? <Spinner className='h-6 min-h-6 w-6 min-w-6 transition-colors duration-200' /> : children}
        </button>
    )
)

EventButton.displayName = 'EventButton'
