import { useState } from "react";
import clsx from "clsx";
import { ActiveOrders } from "./ActiveOrders/ActiveOrders";
import { OrderHistory } from "./OrderHistory/OrderHistory";

export const MyOrdersPage = () => {
    const [activeTab, setActiveTab] = useState('ongoing');

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex justify-around border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('ongoing')}
                    className={clsx('py-2 w-1/2 text-center', {
                        'border-b-2 border-primary text-primary font-semibold': activeTab === 'ongoing',
                        'text-gray-500': activeTab !== 'ongoing'
                    })}
                >
                    Aktivne
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={clsx('py-2 w-1/2 text-center', {
                        'border-b-2 border-primary text-primary font-semibold': activeTab === 'history',
                        'text-gray-500': activeTab !== 'history'
                    })}
                >
                    Istorija
                </button>
            </div>

            {/* Content */}
            {activeTab === 'ongoing' && <ActiveOrders />}
            {activeTab === 'history' && <OrderHistory />}
        </div>
    );
};
