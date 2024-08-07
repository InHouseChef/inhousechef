import clsx from 'clsx'
import { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean
}
export const Label = ({ children, required, className, ...rest }: LabelProps) => (
    <label
        className={clsx(
            'cursor-pointer whitespace-nowrap font-normal',
            { 'after:ml-1 after:text-red900 after:content-["*"]': !!required },
            className
        )}
        {...rest}>
        {children}
    </label>
)
