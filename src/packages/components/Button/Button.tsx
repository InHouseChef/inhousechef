import { cva, VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { ButtonHTMLAttributes } from 'react'

const BUTTON_VARIANTS = cva(
    'flex items-center gap-4 max-w-max rounded-md transition duration-300 active:shadow-[0_-3px_0_0_#00000080_inset)] min-w-max',
    {
        variants: {
            variant: {
                solid: 'text-white px-4 py-2',
                outline: 'border text-gray-700 px-4 py-2',
                text: 'active:shadow-none'
            },
            state: {
                primary: '',
                secondary: '',
                danger: '',
                warning: '',
                success: '',
                info: ''
            },
            size: {
                xs: 'h-6 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:min-w-6',
                sm: 'h-8 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:min-w-6',
                md: 'h-10 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:min-w-5',
                lg: 'h-12 [&>svg]:w-5 [&>svg]:h-5'
            },
            disabled: {
                true: 'cursor-default pointer-events-none',
                false: 'cursor-pointer'
            }
        },
        compoundVariants: [
            // PRIMARY
            {
                variant: 'solid',
                state: 'primary',
                disabled: false,
                className: 'bg-primary hover:bg-primary-hover'
            },
            {
                variant: 'solid',
                state: 'primary',
                disabled: true,
                className: 'bg-primary500'
            },
            {
                variant: 'outline',
                state: 'primary',
                disabled: false,
                className: 'border-primary text-primary hover:bg-primary'
            },
            {
                variant: 'outline',
                state: 'primary',
                disabled: true,
                className: 'border-primary500 text-primary500'
            },
            {
                variant: 'text',
                state: 'primary',
                disabled: false,
                className: 'text-primary hover:text-primary-hover'
            },
            {
                variant: 'text',
                state: 'primary',
                disabled: true,
                className: 'text-primary500'
            },
            // SECONDARY
            {
                variant: 'solid',
                state: 'secondary',
                disabled: false,
                className: 'bg-black hover:bg-primary'
            },
            {
                variant: 'solid',
                state: 'secondary',
                disabled: true,
                className: 'bg-grey800'
            },
            {
                variant: 'outline',
                state: 'secondary',
                disabled: false,
                className: 'border-grey500 hover:bg-grey500'
            },
            {
                variant: 'outline',
                state: 'secondary',
                disabled: true,
                className: 'border-grey800 text-grey800'
            },
            {
                variant: 'text',
                state: 'secondary',
                disabled: false,
                className: 'text-gray-700 hover:text-primary'
            },
            {
                variant: 'text',
                state: 'secondary',
                disabled: true,
                className: 'text-grey800'
            },
            // DANGER
            {
                variant: 'solid',
                state: 'danger',
                disabled: false,
                className: 'bg-red800 hover:bg-red'
            },
            {
                variant: 'solid',
                state: 'danger',
                disabled: true,
                className: 'bg-red500'
            },
            {
                variant: 'outline',
                state: 'danger',
                disabled: false,
                className: 'border-red800 text-red800 hover:bg-red800'
            },
            {
                variant: 'outline',
                state: 'danger',
                disabled: true,
                className: 'border-red500 text-red500'
            },
            {
                variant: 'text',
                state: 'danger',
                disabled: false,
                className: 'text-red800 hover:text-red'
            },
            {
                variant: 'text',
                state: 'danger',
                disabled: true,
                className: 'text-red500'
            },
            // WARNING
            {
                variant: 'solid',
                state: 'warning',
                disabled: false,
                className: 'bg-orange hover:bg-orange800'
            },
            {
                variant: 'solid',
                state: 'warning',
                disabled: true,
                className: 'bg-orange500'
            },
            {
                variant: 'outline',
                state: 'warning',
                disabled: false,
                className: 'border-orange text-orange hover:bg-orange'
            },
            {
                variant: 'outline',
                state: 'warning',
                disabled: true,
                className: 'border-orange500 text-orange500'
            },
            {
                variant: 'text',
                state: 'warning',
                disabled: false,
                className: 'text-orange hover:text-orange800'
            },
            {
                variant: 'text',
                state: 'warning',
                disabled: true,
                className: 'text-orange500'
            },
            // SUCCESS
            {
                variant: 'solid',
                state: 'success',
                disabled: false,
                className: 'bg-green800 hover:bg-green'
            },
            {
                variant: 'solid',
                state: 'success',
                disabled: true,
                className: 'bg-green500'
            },
            {
                variant: 'outline',
                state: 'success',
                disabled: false,
                className: 'border-green800 text-green800 hover:bg-green800'
            },
            {
                variant: 'outline',
                state: 'success',
                disabled: true,
                className: 'border-green500 text-green500'
            },
            {
                variant: 'text',
                state: 'success',
                disabled: false,
                className: 'text-green800 hover:text-green'
            },
            {
                variant: 'text',
                state: 'success',
                disabled: true,
                className: 'text-green500'
            },
            // INFO
            {
                variant: 'solid',
                state: 'info',
                disabled: false,
                className: 'bg-black/20 hover:bg-black/30'
            },
            {
                variant: 'solid',
                state: 'info',
                disabled: true,
                className: 'bg-grey600'
            },
            {
                variant: 'outline',
                state: 'info',
                disabled: false,
                className: 'border-grey900 text-grey900 hover:bg-grey900'
            },
            {
                variant: 'outline',
                state: 'info',
                disabled: true,
                className: 'border-grey600 text-grey600'
            },
            {
                variant: 'text',
                state: 'info',
                disabled: false,
                className: 'bg-transparent border-transparent text-white/80 hover:text-white'
            },
            {
                variant: 'text',
                state: 'info',
                disabled: true,
                className: 'bg-transparent border-transparent text-white/40'
            }
        ],
        defaultVariants: {
            variant: 'solid',
            state: 'primary',
            size: 'md',
            disabled: false
        }
    }
)

type ButtonVariants = VariantProps<typeof BUTTON_VARIANTS>
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>, ButtonVariants {
    isLoading?: boolean
}

export const Button = ({ children, className, variant, state, size, disabled, isLoading, ...rest }: ButtonProps) => {
    const classes = BUTTON_VARIANTS({ variant, state, size, disabled })

    return (
        <button className={clsx(classes, className)} disabled={Boolean(disabled)} {...rest}>
            {children}
            {/* {isLoading ? <Spinner className='' /> : undefined} */}
        </button>
    )
}
