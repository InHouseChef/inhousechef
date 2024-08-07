'use client'

import { Loader } from '@/components'
import { useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { ReactNode, useEffect } from 'react'

interface PublicLayoutProps {
    children?: ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
    const currentYear = new Date().getFullYear()

    const { safeReplace } = useSafeReplace()

    const { data: identity, isFetching: isFetchingIdentity } = useReadIdentity()

    useEffect(() => {
        if (isFetchingIdentity || !identity) return

        safeReplace('/')
    }, [identity, isFetchingIdentity])

    if (isFetchingIdentity || identity) return <Loader />

    return (
        <div className='grid w-screen grid-cols-12'>
            <div className='relative col-span-full p-10'>
                {/* <div className='pointer-events-none absolute inset-0 z-0'>
                    <Image className='h-full w-full object-cover' src={AuthBgImg} alt='bg-shape' />
                </div> */}
                <div className='relative z-10 mx-auto flex h-full max-w-sm flex-col justify-between'>
                    <div className='relative h-[70px]'>
                        {/* {logo ? (
                            <Image fill src={logo} className='object-scale-down object-left-top' alt='logo' />
                        ) : (
                            <LogoDark />
                        )} */}
                    </div>
                    <div className='relative min-h-24'>{children}</div>
                    <p className='text-xs'>© {currentYear} Kristal Ketering</p>
                </div>
            </div>
        </div>
    )
}
