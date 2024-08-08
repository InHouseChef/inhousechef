'use client'

import { useDisableScroll, useOnClickOutside } from '@/packages/hooks'
import { ArrowLeft, X } from '@/packages/icons'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { ReactNode, useRef } from 'react'
import { DrawerPortal } from './components'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

type DrawerAnatomy = 'trigger' | 'portal' | 'overlay' | 'content' | 'mobileClose' | 'desktopClose' | 'title'

interface DrawerProps {
    children: ReactNode
    trigger: ReactNode
    isOpen: boolean
    onOpen: VoidFunction
    onClose: VoidFunction
    title?: string | ReactNode
    size?: Size
    usePortal?: boolean
    closeOnClickOutside?: boolean
    classes?: Partial<Record<DrawerAnatomy, string>>
}

const SIZES: Record<Size, string> = {
    xs: 'w-[370px]',
    sm: 'w-[460px]',
    md: 'w-[550px]',
    lg: 'w-[720px]',
    xl: 'w-[910px]',
    xxl: 'w-[1024px]'
}

export const Drawer = ({
    children,
    trigger,
    title,
    isOpen,
    onOpen,
    onClose,
    size = 'md',
    usePortal = true,
    closeOnClickOutside = true,
    classes
}: DrawerProps) => {
    const ref = useRef(null)

    useOnClickOutside({ ref, onEvent: () => closeOnClickOutside && onClose() })
    useDisableScroll(isOpen)

    return (
        <Dialog.Root open={isOpen}>
            <div onClick={onOpen} className={clsx(classes?.trigger)}>
                {trigger}
            </div>
            <DrawerPortal usePortal={usePortal}>
                <Dialog.Overlay
                    onClick={onClose}
                    className={clsx(
                        'fixed bottom-0 right-0 top-[var(--topnav-height)] z-45 w-full bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-500 data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn lg:w-[calc(100%-var(--main-nav-desktop-width))]',
                        classes?.overlay
                    )}
                />
                <Dialog.Content
                    ref={ref}
                    onEscapeKeyDown={onClose}
                    className={clsx(
                        `fixed bottom-0 right-0 top-[var(--topnav-height)] z-50 data-[state=closed]:animate-slideOutRight data-[state=open]:animate-slideInRight ${SIZES[size]} max-w-full lg:max-w-[calc(100%-var(--main-nav-desktop-width))]`,
                        classes?.content
                    )}>
                    <div className='relative flex h-full w-full flex-col overflow-y-auto bg-white p-6'>
                        <button
                            onClick={onClose}
                            className={clsx('flex items-center text-grey md:hidden', classes?.mobileClose)}>
                            <ArrowLeft /> Back
                        </button>
                        {title ? (
                            typeof title === 'string' ? (
                                <h1 className={clsx('text-2xl md:text-3xl md:leading-10', classes?.title)}>{title}</h1>
                            ) : (
                                title
                            )
                        ) : undefined}

                        <div
                            className={clsx('grow', {
                                'mt-6': title
                            })}>
                            {children}
                        </div>
                        <button
                            onClick={onClose}
                            className={clsx('event absolute right-6 top-6 hidden md:block', classes?.desktopClose)}>
                            <X />
                        </button>
                    </div>
                </Dialog.Content>
            </DrawerPortal>
        </Dialog.Root>
    )
}
