import { useReadMyOrders } from "@/api/order/repository/hooks/readMyOrder";
import { ReadMyOrderResponse } from "@/api/order";
import { calculateDateRange } from "@/app/(protected)/employee/companies/[companyCode]/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import clsx from "clsx";
import { getToLocalISOString } from "@/utils/date";
import ReadOnlyCart from "../../ReadOnlyCart/ReadOnlyCart";

export const OrderHistory = () => {
    const { from, to } = calculateDateRange(getToLocalISOString(new Date()), -30);
    const { companyCode } = useParams<{ companyCode: string }>();
    
    const [selectedOrder, setSelectedOrder] = useState<ReadMyOrderResponse | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { data: orderHistory, isFetching, refetch, isRefetching } = useReadMyOrders({
        path: { companyCode },
        query: { 
            filter: { 
                fromDate: to, 
                toDate: from, 
                orderStates: ["Confirmed", "Cancelled"].join(','), 
                orderTypes: ["Scheduled", "Immediate"].join(',') 
            }
        },
        options: { enabled: false }
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const getOrderSummary = (order: ReadMyOrderResponse) => {
        const number = order.number;
        const forDate = order.orderDate;
        const placedAt = order.placedAt;
        const confirmedAt = order.confirmedAt;
        const concatDescription = order.orderItems.map(item => `${item.name} x${item.quantity}`).join(', ');
        const description = concatDescription.length > 50 ? `${concatDescription.slice(0, 50)}...` : concatDescription;
        const totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { description, totalPrice, forDate, placedAt, confirmedAt, number };
    };

    const handleSelectOrder = (order: ReadMyOrderResponse) => {
        setSelectedOrder(order); // Set the selected order
        setIsCartOpen(true); // Open the cart
    };

    const handleCloseCart = () => {
        setIsCartOpen(false); // Close the cart
        setSelectedOrder(null); // Clear the selected order
    };

    return (
        <div className="mt-6">
            {(isFetching || isRefetching) && <Loader />}
            {(!isFetching && !isRefetching) && orderHistory?.map((order) => {
                const { description, totalPrice, forDate, placedAt, confirmedAt, number } = getOrderSummary(order);
                return (
                    <div 
                        key={order.id} 
                        className="mb-4 bg-white cursor-pointer" 
                        onClick={() => handleSelectOrder(order)} // Pass the entire order to ReadOnlyCart
                    >
                        <div className='flex flex-row gap-8 mb-2'>
                            <p className="text-md text-black-900 font-medium">Status:</p>
                            <p className={clsx('text-md font-bold', 
                                { 
                                    'text-[#2F80ED]/75': order.state === "Draft",
                                    'text-[#2F80ED]': order.state === "Placed",
                                    'text-[#27AE60]': order.state === "Confirmed", 
                                    'text-[#EB5757]': order.state === "Cancelled" 
                                })}>{order.state}</p>
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
                                    <p className="text-sm text-grey-500">
                                        <span className="text-sm text-blue-500">{totalPrice.toFixed(2)} RSD</span> | {description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {isCartOpen && (
                <ReadOnlyCart 
                    order={selectedOrder} // Pass the selected order as a prop
                    isOpen={isCartOpen}
                    onClose={handleCloseCart} // Pass the onClose handler to close the cart
                />
            )}
        </div>
    );
};
