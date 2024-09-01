'use client'

import { ReadUserCompanyResponse } from '@/api/companies'
import { readUserCompany } from '@/api/companies/repository/hooks/readUserCompany'
import { Loader } from '@/components'
import { useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { useCompanyStore } from '@/state'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface MainLayoutProps {
    children?: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const router = useRouter()
    const [userCompany, setUserCompany] = useState<ReadUserCompanyResponse>()
    const { data: identity, isFetched, isFetching: isFetchingIdentity } = useReadIdentity()
    const { roles } = useRoles()
    const [isFetchingCompany, setIsFetchingCompany] = useState(false)
    const setCompany = useCompanyStore(state => state.setCompany)
    const getCompany = useCompanyStore(state => state.getCompany)

    useEffect(() => {
        if (!isFetched) return

        if (!identity) return router.push('/login')

        console.log('identity', identity)

        if (identity && roles.Admin) {
            console.log('admin')
            return router.push('/admin/companies')
        }

        if (identity && (roles.Employee || roles.CompanyManager)) {
            console.log('employee or company manager')
            const company = getCompany()
            console.log('company', company)
            if (company.companyCode && company.companyId) {
                console.log('company.companyCode', company.companyCode)
                return router.push(`/employee/companies/${company.companyCode}`)
            } else {
                console.log('no company code or id')
                setIsFetchingCompany(true)
                readUserCompany().then(company => {
                    setIsFetchingCompany(false)
                    setCompany(company.companyCode, company.companyId)
                    setUserCompany(company)
                    console.log('company', company)
                    console.log('company.companyCode', company.companyCode)
                })
            }
        }
    }, [identity, isFetchingIdentity, userCompany])

    if (isFetchingCompany || isFetchingIdentity) return <Loader />

    return (
        <section className='w-full bg-primary'>
            <div className='flex h-full items-center justify-center'>{children}</div>
        </section>
    )
}
