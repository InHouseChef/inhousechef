'use client'
import { useUid } from '@/packages/hooks'
import { EyeOff } from '@/packages/icons'
import { Eye } from '@/packages/icons/src/Eye'
import clsx from 'clsx'
import { forwardRef, useState } from 'react'
import { FieldProps } from '../../types'
import { Label } from '../Label'
import { Message } from '../Message'

export interface InputProps extends FieldProps {}

export const Password = forwardRef<HTMLInputElement, InputProps>(
    ({ id, label, required, message, icon, tooltip, className, ...rest }, ref) => {
        const [type, setType] = useState<'text' | 'password'>('password')
        const _id = useUid(id)

        return (
            <div className={`relative flex flex-col gap-1 ${className}`}>
                {label && (
                    <Label htmlFor={_id} required={required}>
                        {label}
                    </Label>
                )}
                <div className='relative h-12'>
                    <input
                        id={_id}
                        ref={ref}
                        type={type}
                        {...rest}
                        className={clsx(
                            'h-full w-full rounded-lg border bg-[#fcfcff] px-3 py-2.5 outline-none transition-colors duration-200',
                            icon && 'pr-12',
                            message && 'border-red',
                            'disabled:bg-grey300 disabled:text-grey500 disabled:opacity-100',
                            'placeholder:text-[#b5bbc6]',
                            {
                                'focus-within:[+:svg]text-red border-red focus-within:border-red hover:border-red': message,
                                'focus-within:[+:svg]text-primary border-grey700 focus-within:border-primary hover:border-primary/[.5]':
                                    !message
                            },
                            'input'
                        )}
                    />

                    <button
                        type='button'
                        tabIndex={-1}
                        className={clsx(
                            'absolute right-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 transform',
                            tooltip && 'pointer-events-auto',
                            {
                                'text-red focus-within:text-red hover:text-red': message,
                                'text-grey hover:text-primary': !message
                            }
                        )}
                        onClick={() => setType(type === 'text' ? 'password' : 'text')}>
                        {type === 'text' ? <EyeOff /> : <Eye />}
                    </button>
                </div>
                {message ? <Message>{message}</Message> : undefined}
            </div>
        )
    }
)

Password.displayName = 'Password'
