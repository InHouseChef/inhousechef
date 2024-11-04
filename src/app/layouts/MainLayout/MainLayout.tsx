'use client'

import { useReadUserCompany } from '@/api/companies/repository/hooks/readUserCompany'
import { Loader } from '@/components'
import { NotificationPopper } from '@/components/NotificationPopper/NotificationPopper'
import { useReadIdentity } from '@/hooks/useIdentity'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { useCompanyStore } from '@/state'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface MainLayoutProps {
    children?: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const router = useRouter()
    const { data: identity, isFetched, isFetching: isFetchingIdentity } = useReadIdentity()
    const { roles } = useRoles()
    const setCompany = useCompanyStore(state => state.setCompany)
    const getCompany = useCompanyStore(state => state.getCompany)
    const {data: userCompanyData, isFetching: isFetchingCompany } = useReadUserCompany()

    useEffect(() => {
        if (!isFetched) return

        if (!identity) return router.push('/login')

        setCompany(userCompanyData?.companyCode, userCompanyData?.companyId)

        if (identity && roles.Admin) {
            return router.push('/admin/companies')
        }

        if (identity && (roles.Employee || roles.CompanyManager)) {
            const company = getCompany()
            return router.push(`/companies/${company.companyCode}`)
        }

        if (identity && roles.RestaurantWorker) {
            const company = getCompany()
            return router.push(`/restaurant/companies/${company.companyCode}/orders`)
        }

    }, [identity, isFetchingIdentity])

    if (isFetchingCompany || isFetchingIdentity) return <Loader />

    return (
        <section className='w-full bg-primary'>
            <div className='flex h-full items-center justify-center'>{children}</div>
            <NotificationPopper />
        </section>
    )
}