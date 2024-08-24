'use client'
import { Loader, Main, TopNav } from '@/components'
import { useBaseUrl, useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { ReactNode, useEffect } from 'react'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    const { baseUrl } = useBaseUrl()

    const { data: identity, isFetching: isFetchingIdentity } = useReadIdentity()
    const { safeReplace } = useSafeReplace()

    useEffect(() => {
        if (isFetchingIdentity || identity) return
        safeReplace(`${baseUrl}/login`)
    }, [identity, isFetchingIdentity])

    if (isFetchingIdentity || !identity) return <Loader />

    return (
        <>
            <div className='flex w-full flex-grow flex-col'>
                <TopNav />
                <Main>{children}</Main>
            </div>
        </>
    )
}
