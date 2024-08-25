'use client'

import { ReadUserCompanyResponse } from '@/api/companies'
import { readUserCompany } from '@/api/companies/repository/hooks/readUserCompany'
import { Loader } from '@/components'
import { useSafeReplace } from '@/hooks'
import { useReadIdentity } from '@/hooks/useIdentity'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { useCompanyStore } from '@/state'
import { ReactNode, useEffect, useState } from 'react'

interface MainLayoutProps {
    children?: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const { safeReplace } = useSafeReplace()
    const [userCompany, setUserCompany] = useState<ReadUserCompanyResponse>()
    const { data: identity, isFetched, isFetching: isFetchingIdentity } = useReadIdentity()
    const { roles } = useRoles()
    const [isFetchingCompany, setIsFetchingCompany] = useState(false)
    const setCompany = useCompanyStore(state => state.setCompany)
    const getCompany = useCompanyStore(state => state.getCompany)

    useEffect(() => {
        if (!isFetched) return
        
        if (!identity) return safeReplace('/login') 
            
        if (identity && roles.Admin) {
            return safeReplace('/admin/companies')
        }

        if (identity && (roles.Employee || roles.CompanyManager)) {
            const company = getCompany()

            if (company.companyCode && company.companyId) {
                return safeReplace(`/employee/companies/${company.companyCode}`)
            }
            else {
                setIsFetchingCompany(true)
                readUserCompany()
                .then((company) => {
                    setIsFetchingCompany(false)
                    setCompany(company.companyCode, company.companyId)
                    setUserCompany(company)
                })
            }
        }

    }, [identity, isFetchingIdentity, userCompany])

    if (isFetchingIdentity || isFetchingCompany) return <Loader />

    return (
        <section className='w-full'>
            <div className='flex h-full items-center justify-center'>{children}</div>
        </section>
    )
}
