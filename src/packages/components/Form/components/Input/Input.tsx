'use client'
import { Tooltip } from '@/packages/components'
import { useUid } from '@/packages/hooks'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { FieldProps } from '../../types'
import { Label } from '../Label'
import { Message } from '../Message'

export interface InputProps extends FieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ id, label, required, message, direction = 'column', icon, tooltip, className, disabled, ...rest }, ref) => {
        const _id = useUid(id)

        return (
            <div
                className={clsx(
                    'relative flex',
                    {
                        'flex-row items-center gap-2': direction === 'row',
                        'flex-col items-start justify-start gap-1': direction === 'column'
                    },
                    className
                )}>
                {label && (
                    <Label htmlFor={_id} required={required}>
                        {label}
                    </Label>
                )}
                <div
                    className={clsx('group relative h-12 w-full', {
                        'pointer-events-none': disabled
                    })}>
                    <input
                        id={_id}
                        ref={ref}
                        disabled={disabled}
                        className={clsx(
                            'h-full w-full rounded-lg border bg-[#fcfcff] px-3 py-3 outline-none transition-colors',
                            'disabled:bg-[#f0f1f3] disabled:text-[#545f71] disabled:opacity-100',
                            'placeholder:text-[#b5bbc6]',
                            {
                                'focus:[&:svg]text-red border-red hover:border-red focus:border-red': message,
                                'focus:[&:svg]text-primary border-grey700 hover:border-primary/[.5] focus:border-primary':
                                    !message
                            },
                            { 'pr-12': icon },
                            'input'
                        )}
                        {...rest}
                    />

                    {icon ? (
                        <div
                            className={clsx('absolute right-3 top-1/2 z-[5] h-6 w-6 -translate-y-1/2 transform', {
                                'pointer-events-auto': Boolean(tooltip),
                                'pointer-events-none': !tooltip,
                                'text-red group-focus-within:text-red group-hover:text-red': message,
                                'text-gray group-focus-within:text-primary group-hover:text-primary': !message
                            })}>
                            <Tooltip label={tooltip || ''}>{icon}</Tooltip>
                        </div>
                    ) : undefined}
                </div>
                {message ? <Message>{message}</Message> : undefined}
            </div>
        )
    }
)

Input.displayName = 'Input'
