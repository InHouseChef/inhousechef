import clsx from 'clsx'
import { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean
}
export const Label = ({ children, required, className, ...rest }: LabelProps) => (
    <label
        className={clsx(
            'cursor-pointer whitespace-nowrap font-normal text-white',
            { 'after:text-red900 after:ml-1 after:content-["*"]': !!required },
            className
        )}
        {...rest}>
        {children}
    </label>
)
