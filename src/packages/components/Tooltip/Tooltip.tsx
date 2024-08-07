'use client'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { ReactElement, ReactNode } from 'react'

interface TooltipProps {
    label: string | ReactElement
    children: ReactNode
    variant?: 'dark' | 'light'
    side?: RadixTooltip.TooltipContentProps['side']
}

export const Tooltip = ({ label, children, variant = 'dark', side = 'top' }: TooltipProps) => (
    <RadixTooltip.Provider delayDuration={100}>
        <RadixTooltip.Root>
            <RadixTooltip.Trigger asChild>
                <div className='max-w-max'>{children}</div>
            </RadixTooltip.Trigger>
            <RadixTooltip.Portal>
                <RadixTooltip.Content
                    side={side}
                    sideOffset={4}
                    className={clsx(
                        'z-[60] select-none rounded-[4px]  px-[15px] py-[10px] leading-none text-white will-change-[transform,opacity]',
                        'data-[state=delayed-open]:data-[side=top]:animate-slideUpAndFadeIn',
                        'data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFadeIn',
                        'data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFadeIn',
                        'data-[state=delayed-open]:data-[side=bottom]:animate-slideDownAndFadeIn',
                        { 'bg-black': variant === 'dark', 'border border-grey700/50 bg-white': variant === 'light' }
                    )}>
                    {label}
                    <RadixTooltip.Arrow
                        className={clsx('relative bottom-[1px]', {
                            'fill-black': variant === 'dark',
                            'fill-grey700/50': variant === 'light'
                        })}
                    />
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    </RadixTooltip.Provider>
)
