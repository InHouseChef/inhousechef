'use client'

import { RolesEnum, useReadMyUser } from '@/api/users'
import { useCartStore } from '@/app/(protected)/newstate'
import { Loader } from '@/components'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { CompanyUserRole, CompanyUserRoles } from '@/types'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MainMenu from './MainMenu/MainMenu'
import { TermsAndConditionsDialog } from './TermsAndConditionsDialog/TermsAndConditionsDialog'

export const NewCompanyOrderForm = () => {
    const { companyCode } = useParams<{ companyCode: string }>()
    const { roles } = useRoles()
    const { data: myUser, isLoading: isLoadingMyUser, isFetched } = useReadMyUser()
    const loadCartData = useCartStore(state => state.loadCartData)

    const roleMapping: Record<CompanyUserRole, RolesEnum> = {
        Admin: RolesEnum.Admin,
        CompanyManager: RolesEnum.CompanyManager,
        Employee: RolesEnum.Employee,
        RestaurantWorker: RolesEnum.RestaurantWorker
    }

    const getActiveRole = (roles: CompanyUserRoles): RolesEnum => {
        const roleEntries = Object.entries(roles) as [CompanyUserRole, boolean][]
        const activeRole = roleEntries.find(([role, isActive]) => isActive)!
        return roleMapping[activeRole[0]]
    }

    useEffect(() => {
        if (myUser) {
            const role = getActiveRole(roles)
            loadCartData(companyCode, role, myUser.aLaCardPermission) // Load all cart data after login
        }
    }, [loadCartData, myUser])

    if (isLoadingMyUser) return <Loader />

    return (
        <div>
            {!myUser?.acceptedTerms ? <TermsAndConditionsDialog acceptedTerms={myUser?.acceptedTerms} /> : undefined}
            <MainMenu />
        </div>
    )
}
