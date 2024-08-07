import { InputHTMLAttributes, ReactElement, ReactNode } from 'react'

export type ControlDirection = 'row' | 'column'

export type FieldProps<T = InputHTMLAttributes<HTMLInputElement>> = T & {
    label?: string
    required?: boolean
    message?: string
    direction?: ControlDirection
    icon?: ReactNode
    tooltip?: string | ReactElement
}

export interface ControlledFieldProps<T = string> extends Omit<FieldProps, 'value' | 'defaultValue' | 'onChange'> {
    value: T
    defaultValue?: T
    onChange: (value: T) => void
}
