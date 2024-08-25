'use client'
import { Loader, Main, RequireCompanyAuthorization, TopNav } from '@/components'
import { useBaseUrl, useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { RoleProvider } from '@/providers/RoleProvider/RoleProvider'
import { ReactNode, useEffect } from 'react'

interface AdminProtectedLayoutProps {
    children?: ReactNode
}

export const AdminProtectedLayout = ({ children }: AdminProtectedLayoutProps) => {
    const { baseUrl } = useBaseUrl()

    const { data: identity, isFetching: isFetchingIdentity } = useReadIdentity()
    const { safeReplace } = useSafeReplace()

    useEffect(() => {
        if (isFetchingIdentity || identity) return
        safeReplace(`${baseUrl}/login`)
    }, [identity, isFetchingIdentity])

    if (isFetchingIdentity || !identity) return <Loader />

    return (
        <RoleProvider>
            <RequireCompanyAuthorization role='Admin'>
                <div className='flex w-full flex-grow flex-col'>
                    <Main>{children}</Main>
                </div>
            </RequireCompanyAuthorization>
        </RoleProvider>
    )
}