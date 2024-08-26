'use client'
import { Label, Message } from '@/packages/components/Form'
import { FieldProps } from '@/packages/components/Form/types'
import clsx from 'clsx'
import { forwardRef, useId } from 'react'

interface CheckboxProps extends FieldProps {
    autoHeight?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, required, message, direction = 'column', icon, autoHeight, ...rest }, ref) => {
        const _id = useId()

        const classNames = clsx('relative flex', {
            'flex-row-reverse items-center justify-end gap-2': direction === 'row',
            'flex-col items-start justify-start gap-1': direction === 'column'
        })

        return (
            <div className={classNames}>
                {label ? (
                    <Label htmlFor={_id} required={required}>
                        {label}
                    </Label>
                ) : undefined}
                {icon}
                <div
                    className={clsx('flex items-center', {
                        'h-auto': autoHeight,
                        'h-11': !autoHeight
                    })}>
                    <div>
                        <input
                            id={_id}
                            type='checkbox'
                            ref={ref}
                            className='peer absolute inline-block h-5 w-5 cursor-pointer opacity-0'
                            {...rest}
                        />
                        <div className='peer-checked:disabled:border-primary500 peer-checked:disabled:bg-primary500 pointer-events-none flex h-5 w-5 select-none items-center justify-center rounded-[3px] border border-[#ced3e0] text-white peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-hover:border-[#c9d6ff] peer-hover:text-[#c9d6ff]'>
                            <svg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M1 3L3 5L7 1' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                        </div>
                    </div>
                </div>
                {message ? <Message>{message}</Message> : undefined}
            </div>
        )
    }
)

Checkbox.displayName = 'Checkbox'
