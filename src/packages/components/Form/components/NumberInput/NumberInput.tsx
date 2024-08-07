'use client'

import { Tooltip } from '@/packages/components'
import { useUid } from '@/packages/hooks'
import clsx from 'clsx'
import { ChangeEvent, FocusEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ControlledFieldProps } from '../../types'
import { Label } from '../Label'
import { Message } from '../Message'
import { formatNumberValue } from './utils'

export interface NumberInputProps extends ControlledFieldProps<number | string | null> {
    fractionDigits?: number
    maxLength?: number
    className?: string
    checkInitialValue?: boolean
}

interface NumberInputRef {
    current: HTMLInputElement | null
}

export const NumberInput = forwardRef<NumberInputRef, NumberInputProps>(
    (
        {
            id,
            label,
            message,
            direction = 'column',
            icon,
            tooltip,
            defaultValue,
            name,
            disabled,
            value,
            onChange,
            onBlur,
            fractionDigits = 0,
            maxLength = 10,
            required,
            className,
            checkInitialValue = true,
            ...rest
        },
        ref
    ) => {
        const _id = useUid(id)

        const toFractionDigits = (value: number | string | null) => Number(value).toFixed(fractionDigits)

        const [_value, _setValue] = useState<string>('')
        const [selectionStart, setSelectionStart] = useState<number>(0)
        const [hasInitialValue, setHasInitialValue] = useState<boolean>(false)

        const inputRef = useRef<HTMLInputElement>(null)

        useImperativeHandle(ref, () => ({ current: inputRef.current }))

        useEffect(() => {
            if (!inputRef || !inputRef.current) return
            inputRef.current.selectionStart = selectionStart
            inputRef.current.selectionEnd = selectionStart
        }, [_value])

        const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.value === '.') hasInitialValue ? (event.target.value = '0.') : (event.target.value = '')
            event.target.value = formatNumberValue(event.target.value, fractionDigits)
            if (isNaN(Number(event.target.value))) event.target.value = '0.'
        }

        const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
            const isEmptyString = event.target.value === ''
            event.target.value = Number(event.target.value).toFixed(fractionDigits)

            if (isEmptyString && !hasInitialValue) {
                event.target.value = ''
            }

            _setValue(event.target.value)

            onBlur && onBlur(event)
        }

        const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
            const data = event.target.value
            const selectionPosition = event.target.selectionStart
            if (selectionPosition !== null) setSelectionStart(selectionPosition)
            onChange(!hasInitialValue && !data ? null : Number(data))
            Promise.resolve(null).then(() => {
                _setValue(data)
            })
        }

        useEffect(() => {
            if (checkInitialValue && value !== undefined && value !== '') return setHasInitialValue(true)
        }, [])

        useEffect(() => {
            if ((value === undefined || value === '' || value === null) && !hasInitialValue) return _setValue('')
            if (value === undefined && hasInitialValue) return _setValue(toFractionDigits(''))
            _setValue(toFractionDigits(value))
        }, [value])

        return (
            <div
                className={clsx(
                    'relative flex',
                    {
                        'flex-row items-center gap-2 ': direction === 'row',
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
                        className={clsx(
                            'h-full w-full rounded-lg border bg-[#fcfcff] px-3 py-3 outline-none transition-colors',
                            'disabled:bg-grey300 disabled:text-grey500 disabled:opacity-100',
                            'placeholder:text-[#b5bbc6]',
                            {
                                'focus:[&:svg]text-red border-red hover:border-red focus:border-red': message,
                                'focus:[&:svg]text-primary border-grey700 hover:border-primary/[.5] focus:border-primary':
                                    !message
                            },
                            { 'pr-12': icon },
                            'input'
                        )}
                        ref={inputRef}
                        id={_id}
                        value={_value}
                        onInput={handleInputChange}
                        onChange={handleOnChange}
                        onBlur={handleInputBlur}
                        maxLength={maxLength}
                        {...rest}
                    />
                    {icon ? (
                        <div
                            className={clsx(
                                'pointer-events-none absolute right-3 top-1/2 z-[5] h-6 w-6 -translate-y-1/2 transform',
                                tooltip && 'pointer-events-auto',
                                {
                                    'text-red  group-focus-within:text-red group-hover:text-red': message,
                                    'text-grey group-focus-within:text-primary group-hover:text-primary': !message
                                }
                            )}>
                            <Tooltip label={tooltip || ''}>{icon}</Tooltip>
                        </div>
                    ) : undefined}
                </div>
                {message ? <Message>{message}</Message> : undefined}
            </div>
        )
    }
)

NumberInput.displayName = 'NumberInput'
