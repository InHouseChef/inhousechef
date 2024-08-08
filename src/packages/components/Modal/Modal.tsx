'use client'

import { useDisableScroll, useOnClickOutside } from '@/packages/hooks'
import { X } from '@/packages/icons'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import Image from 'next/image'
import { ReactNode, useRef } from 'react'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
    children: ReactNode
    trigger?: ReactNode
    isOpen: boolean
    onOpen?: VoidFunction
    onClose?: VoidFunction
    title?: string
    size?: Size
    image?: string
    fullscreen?: boolean
    closeButton?: boolean
    className?: string
}

const SIZES: Record<Size, string> = {
    xs: 'w-[370px] h-[280px]',
    sm: 'w-[460px] h-[340px]',
    md: 'w-[550px] h-[410px]',
    lg: 'w-[720px] h-[540px]',
    xl: 'w-[1068px] h-[640px]'
}

export const Modal = ({
    children,
    trigger,
    title,
    isOpen,
    onOpen,
    onClose,
    size = 'md',
    image,
    fullscreen,
    className
}: ModalProps) => {
    const ref = useRef(null)
    useOnClickOutside({ ref, onEvent: () => onClose && onClose() })
    useDisableScroll(isOpen)

    return (
        <Dialog.Root open={isOpen}>
            {trigger ? <div onClick={onOpen}>{trigger}</div> : undefined}
            <Dialog.Portal>
                <Dialog.Overlay
                    className={clsx(
                        'fixed bottom-0 right-0 z-50 bg-[#1B1C31]/50 backdrop-blur-[5px] backdrop-filter transition-opacity duration-300 data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn',
                        {
                            'h-[calc(100vh-var(--topnav-height))] w-full lg:w-[calc(100dvw-var(--main-nav-desktop-width))]':
                                !fullscreen,
                            'h-screen w-screen': fullscreen
                        }
                    )}>
                    <Dialog.Content
                        ref={ref}
                        className={clsx(
                            `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white outline-none data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn ${SIZES[size]} z-50 max-h-[calc(100%-32px)] max-w-[calc(100%-32px)] overflow-hidden rounded-[20px]`,
                            className
                        )}>
                        {image ? (
                            <div className='pointer-events-none absolute inset-0 z-0'>
                                <Image className='h-full w-full object-cover' src={image} alt='Upload background image' />
                            </div>
                        ) : undefined}
                        <div className='relative z-5 h-full w-full  p-6'>
                            {title ? <h1 className='mb-6'>{title}</h1> : undefined}
                            {children}
                            {onClose ? (
                                <button onClick={onClose} className='event absolute right-6 top-6'>
                                    <X />
                                </button>
                            ) : undefined}
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
