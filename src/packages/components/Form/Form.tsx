import clsx from 'clsx'
import { FormEventHandler, HTMLAttributes, ReactNode } from 'react'

interface FormProps extends HTMLAttributes<HTMLFormElement> {
    children?: ReactNode
    onSubmit?: FormEventHandler
    autocomplete?: string
}

export const Form = ({ children, onSubmit, autocomplete = 'off', className, ...rest }: FormProps) => (
    <form
        className={clsx('flex flex-grow flex-col min-h-0', className)}
        noValidate
        autoComplete={autocomplete}
        onSubmit={onSubmit}
        {...rest}>
        {children}
    </form>
)
