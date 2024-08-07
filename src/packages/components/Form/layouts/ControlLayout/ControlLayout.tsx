import clsx from 'clsx'
import { ReactNode } from 'react'
import { ControlDirection } from '../../types'

interface ControlLayoutProps {
    fullHeight?: boolean
    direction?: ControlDirection
    children?: ReactNode
}

export const ControlLayout = ({ fullHeight = false, children }: ControlLayoutProps) => (
    <div
        className={clsx(
            'control-layout relative flex flex-col gap-1 [&>input::placeholder]:text-grey700 [&>textarea]:min-h-20',
            {
                'h-full [&>div]:h-full': fullHeight,
                'h-auto [&>div]:h-auto': !fullHeight
            }
        )}>
        {children}
    </div>
)
