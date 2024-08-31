'use client'

import { useCartStore } from '@/app/(protected)/employee/newstate';
import React, { useEffect } from 'react';
import MainMenu from './MainMenu/MainMenu';
import Cart from './Cart/Cart';
import { useParams } from 'next/navigation';

export const NewCompanyOrderForm: React.FC = () => {
    const { companyCode } = useParams<{ companyCode: string }>();
    const loadCartData = useCartStore(state => state.loadCartData);

    useEffect(() => {
        loadCartData(companyCode); // Load all cart data after login
    }, [loadCartData]);

    return (
        <div>
            <MainMenu />
            {/* <Cart /> */}
        </div>
    );
};
