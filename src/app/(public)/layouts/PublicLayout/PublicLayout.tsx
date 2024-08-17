'use client'

import { Loader } from '@/components'
import { useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { ReactNode, useEffect } from 'react'

interface PublicLayoutProps {
    children?: ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
    // const currentYear = new Date().getFullYear()

    const { safeReplace } = useSafeReplace()

    const { data: identity, isFetching: isFetchingIdentity } = useReadIdentity()

    useEffect(() => {
        if (isFetchingIdentity || !identity) return

        safeReplace('/companies')
    }, [identity, isFetchingIdentity])

    if (isFetchingIdentity || identity) return <Loader />

    return (
        <>
            <section className='w-full'>
                <div className='flex h-screen items-center justify-center'>{children}</div>
            </section>
        </>
    )
}
