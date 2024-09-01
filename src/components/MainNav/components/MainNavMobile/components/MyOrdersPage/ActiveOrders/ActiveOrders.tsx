import { useCartStore } from '@/app/(protected)/employee/newstate';
import { useReadMyOrders } from "@/api/order/repository/hooks/readMyOrder";
import { ReadMyOrderResponse } from "@/api/order";
import { calculateDateRange } from "@/app/(protected)/employee/companies/[companyCode]/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import clsx from "clsx";
import { getToLocalISOString } from "@/utils/date";

export const ActiveOrders = () => {
    const { from, to } = calculateDateRange(getToLocalISOString(new Date()), 2);
    const { companyCode } = useParams<{ companyCode: string }>();

    const { data: activeOrders, refetch, isFetching, isRefetching } = useReadMyOrders({
        path: { companyCode },
        query: {
            filter: {
                fromDate: from,
                toDate: to,
                orderStates: ["Draft", "Placed"].join(','),
                orderTypes: ["Scheduled", "Immediate"].join(',')
            }
        },
        options: { enabled: false }
    });

    const { setSelectedOrderById, clearSelectedOrder, isOpen, setIsOpen } = useCartStore();

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (!isOpen) {
            refetch();
            clearSelectedOrder();
        }
    }, [isOpen]);

    const getOrderSummary = (order: ReadMyOrderResponse) => {
        const number = order.number;
        const forDate = order.orderDate;
        const type = order.type;
        const concatDescription = order.orderItems.map(item => `${item.name} x${item.quantity}`).join(', ');
        const description = concatDescription.length > 50 ? `${concatDescription.slice(0, 50)}...` : concatDescription;
        const totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { description, totalPrice, number, type, forDate };
    };

    const handleViewOrder = (orderId: string) => {
        setSelectedOrderById(orderId); // Set the selected order
        setIsOpen(true); // Open the cart with the selected order
    };

    return (
        <div className="mt-6">
            {(isFetching || isRefetching) && <Loader />}
            {(!isFetching && !isRefetching) && activeOrders?.map((order) => {
                const { description, totalPrice, number, type, forDate } = getOrderSummary(order);
                return (
                    <div key={order.id} className="mb-4 bg-white">
                        <div className='flex flex-row gap-8 mb-2'>
                            <p className="text-md text-black-900 font-medium">Status:</p>
                            <p className={clsx('text-md font-bold', 
                                { 
                                    'text-[#2F80ED]/75': order.state === "Draft",
                                    'text-[#2F80ED]': order.state === "Placed",
                                    'text-[#27AE60]': order.state === "Confirmed", 
                                    'text-[#EB5757]': order.state === "Cancelled" 
                                })}>{order.state}</p>
                            {type === "Immediate" && (<p className='text-sm text-black-900 font-medium'>Za odmah</p>)}
                            {type === "Scheduled" && (<p className='text-sm text-black-900 font-medium'>Za {forDate}</p>)}
                        </div>
                        <div className="flex justify-between items-center border-t border-grey-300 py-4">
                            <div className="flex items-center gap-4">
                                {order.orderItems.length === 1 ? (
                                    <div className="relative flex-shrink-0 rounded-lg bg-gray-200 h-20 w-20 shadow">
                                        <img
                                            src={order.orderItems[0].imageUrl}
                                            alt={order.orderItems[0].name}
                                            className="h-20 w-20 object-cover rounded-lg"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative grid grid-cols-2 flex-shrink-0 gap-1 w-20 h-20 rounded-lg shadow p-2 bg-gray-200">
                                        {order.orderItems.slice(0, 4).map((item, index) => (
                                            <div key={index} className="w-8 h-8">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover rounded-md"
                                                />
                                            </div>
                                        ))}
                                        {Array.from({ length: 4 - order.orderItems.slice(0, 4).length }).map((_, index) => (
                                            <div key={index} className="w-8 h-8 bg-gray-200 rounded-md"></div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <h4 className="font-semibold">Porudžbina #{number}</h4>
                                    </div>
                                    <p className="text-sm text-grey-500"><span className="text-sm text-blue-500">{totalPrice.toFixed(2)} RSD</span> | {description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <button onClick={() => handleViewOrder(order.id)} className="bg-primary text-white px-4 py-2 rounded">
                                Idi na porudžbinu
                            </button>
                            {order.type === "Scheduled" && (order.state === "Draft" || order.state === "Placed") && (
                                <button onClick={() => handleViewOrder(order.id)} className="border border-primary text-primary px-4 py-2 rounded">
                                    Otkaži
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
