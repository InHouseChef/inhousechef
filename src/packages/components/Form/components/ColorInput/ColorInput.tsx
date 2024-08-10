import { useUid } from '@/packages/hooks'
import clsx from 'clsx'
import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from 'react'
import { ControlledFieldProps } from '../../types'
import { Label } from '../Label/Label'
import { Message } from '../Message/Message'

export interface ColorInputProps extends ControlledFieldProps<string | null> {}

interface ColorInputRef {
    current: HTMLInputElement | null
}

export const ColorInput = forwardRef<ColorInputRef, ColorInputProps>(
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
            value,
            onChange,
            required,
            className,
            ...rest
        },
        ref
    ) => {
        const _id = useUid(id)

        const inputRef = useRef<HTMLInputElement>(null)

        useImperativeHandle(ref, () => ({ current: inputRef.current }))

        const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)

        return (
            <div className={clsx('relative flex flex-col gap-1', className)}>
                {label && (
                    <Label htmlFor={_id} required={required}>
                        {label}
                    </Label>
                )}
                <div className='relative h-11'>
                    <input
                        id={_id}
                        ref={inputRef}
                        value={value || ''}
                        onChange={handleOnChange}
                        {...rest}
                        className={clsx(
                            'input h-full w-full p-2.5',
                            icon ? 'pr-12' : 'pr-3',
                            'rounded-lg border bg-white text-sm font-normal leading-6 outline-none transition',
                            message ? 'border-red500' : 'border-grey400',
                            'enabled:hover:border-primary500 enabled:focus:border-primary500',
                            'disabled:bg-grey200 disabled:text-grey disabled:opacity-100',
                            'placeholder-grey500'
                        )}
                    />
                    <div className='absolute right-2 top-2 h-7 w-12'>
                        <input
                            id={_id}
                            ref={inputRef}
                            value={value || ''}
                            onChange={handleOnChange}
                            {...rest}
                            type='color'
                            className='h-full w-full cursor-pointer opacity-0'
                        />
                        <div
                            className='absolute inset-0 h-full w-full rounded-md content-none'
                            style={{ backgroundColor: value || '#000' }}></div>
                    </div>
                </div>
                {message ? <Message>{message}</Message> : undefined}
            </div>
        )
    }
)

ColorInput.displayName = 'ColorInput'
export default ColorInput
