'use client'

import { useCartStore } from '@/app/(protected)/employee/newstate';
import React, { useEffect } from 'react';
import MainMenu from './MainMenu/MainMenu';
import Cart from './Cart/Cart';
import { useParams } from 'next/navigation';
import { useRoles } from '@/providers/RoleProvider/RoleProvider';
import { CompanyUserRole, CompanyUserRoles } from '@/types';
import { RolesEnum, useReadMyUser } from '@/api/users';

export const NewCompanyOrderForm: React.FC = () => {
    const { companyCode } = useParams<{ companyCode: string }>();
    const { roles } = useRoles();
    const { data: myUser, isLoading: isLoadingMyUser } = useReadMyUser()
    const loadCartData = useCartStore(state => state.loadCartData);

    const roleMapping: Record<CompanyUserRole, RolesEnum> = {
        Admin: RolesEnum.Admin,
        CompanyManager: RolesEnum.CompanyManager,
        Employee: RolesEnum.Employee,
        RestaurantWorker: RolesEnum.RestaurantWorker
    };
    
    const getActiveRole = (roles: CompanyUserRoles): RolesEnum => {
        const roleEntries = Object.entries(roles) as [CompanyUserRole, boolean][];
        const activeRole = roleEntries.find(([role, isActive]) => isActive)!;
        return roleMapping[activeRole[0]]
    };
    useEffect(() => {
        if (myUser)
        {
            const role = getActiveRole(roles);
            loadCartData(companyCode, role, myUser.aLaCardPermission); // Load all cart data after login
        }
    }, [loadCartData, myUser]);

    return (
        <div>
            <MainMenu />
            {/* <Cart /> */}
        </div>
    );
};
