'use client'

// Dashboard.tsx
import { ReadOrderResponse, readOrders, useReadOrders } from '@/api/order';
import React, { useEffect, useState } from 'react';
import OrderCard from '../../../components/OrderCard/OrderCard';
import { usePathParams } from '@/hooks';
import { DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants';
import { DateLocalIso } from '@/types';
import { getToLocalISOString } from '@/utils/date';

const Dashboard = () => {
    const { companyCode } = usePathParams<{ companyCode: string }>()
    const [orders, setOrders] = useState<ReadOrderResponse[] | undefined>(undefined);
    const activeDay = getToLocalISOString(new Date()).split('T')[0] as DateLocalIso;

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         const response = await readOrders({
    //             path: { companyCode },
    //             query: { pagination: DEFAULT_OFFSET_PAGINATION_REQUEST, filter: { forDate: activeDay } }
    //         })
    //         setOrders(response.results);
    //     };
    //     fetchOrders();
    // }, []);

    return (
        <div className="container mx-auto p-4">

        </div>
    );
};

export default Dashboard;
