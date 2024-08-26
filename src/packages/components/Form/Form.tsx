import clsx from 'clsx'
import { FormEventHandler, HTMLAttributes, ReactNode } from 'react'

interface FormProps extends HTMLAttributes<HTMLFormElement> {
    children?: ReactNode
    onSubmit?: FormEventHandler
    autocomplete?: string
}

export const Form = ({ children, onSubmit, autocomplete = 'off', className, ...rest }: FormProps) => (
    <form
        className={clsx('flex min-h-0 flex-grow flex-col', className)}
        noValidate
        autoComplete={autocomplete}
        onSubmit={onSubmit}
        {...rest}>
        {children}
    </form>
)
