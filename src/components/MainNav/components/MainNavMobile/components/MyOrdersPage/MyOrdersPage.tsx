import { ReadMyOrderResponse } from "@/api/order";
import clsx from "clsx";
import { useState } from "react";

type MyOrdersPageProps = {
    activeOrders: ReadMyOrderResponse[];
    orderHistory: ReadMyOrderResponse[];
};

export const MyOrdersPage = ({ activeOrders, orderHistory }: MyOrdersPageProps ) => {
    const [activeTab, setActiveTab] = useState('ongoing');

    // Helper function to calculate total price and concatenate names
    const getOrderSummary = (order: ReadMyOrderResponse) => {
        const concatDescription = order.orderItems.map(item => item.name).join(', ');
        const description = concatDescription.length > 50 ? `${concatDescription.slice(0, 50)}...` : concatDescription;
        const totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { description, totalPrice };
    };

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
            <div className="mt-6">
                {activeTab === 'ongoing' && activeOrders.map((order) => {
                    const { description, totalPrice } = getOrderSummary(order);
                    return (
                        <div key={order.id} className="mb-4 bg-white">
                            <div className='flex flex-row gap-8 mb-2'>
                                <p className="text-md text-black-900 font-medium">Status:</p>
                                <p className="text-md text-green-700 font-bold">{order.state}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-grey-300 py-4">
                                <div className="flex items-center">
                                    {/* Placeholder for image or meal group */}
                                    {order.orderItems.length === 1 ? (
                                        <div className="relative mr-4 flex-shrink-0 rounded-lg bg-gray-200 h-20 w-20 shadow">
                                            <img
                                                src={order.orderItems[0].imageUrl}
                                                alt={order.orderItems[0].name}
                                                className="h-20 w-20 object-cover rounded-lg"
                                            />
                                            {order.orderItems[0].quantity > 0 && (
                                                <div className="absolute left-0 top-0 flex h-10 w-12 items-center justify-center rounded-br-lg rounded-tl-lg bg-primary text-lg text-white">
                                                    {order.orderItems[0].quantity}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative grid grid-cols-2 gap-1 w-20 h-20 rounded-lg shadow p-2 mr-4 bg-gray-200">
                                            {order.orderItems.slice(0, 4).map((item, index) => (
                                                <img
                                                    key={index}
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-8 h-8 object-cover rounded-md"
                                                />
                                            ))}
                                            {/* Fill empty grid spaces if less than 4 items */}
                                            {Array.from({ length: 4 - order.orderItems.slice(0, 4).length }).map((_, index) => (
                                                <div key={index} className="w-8 h-8 bg-gray-200 rounded-md"></div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <h4 className="font-semibold">Porudžbina #123456{/* Placeholder for order number */}</h4>
                                        </div>
                                        <p className="text-sm text-grey-500"><span className="text-sm text-blue-500">{totalPrice.toFixed(2)} RSD</span> | {description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <button onClick={() => console.log('Track Order')} className="bg-primary text-white px-4 py-2 rounded">
                                    Idi na porudžbinu
                                </button>
                                <button onClick={() => console.log('Cancel Order')} className="border border-primary text-primary px-4 py-2 rounded">
                                    Otkaži
                                </button>
                            </div>
                        </div>
                    );
                })}

                {activeTab === 'history' && orderHistory.map((order) => {
                    const { description, totalPrice } = getOrderSummary(order);
                    return (
                        <div key={order.id} className="mb-4 bg-white">
                            <div className='flex flex-row gap-8 mb-2'>
                                <p className="text-md text-black-900 font-medium">Status:</p>
                                <p className="text-md text-green-700 font-bold">{order.state}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-grey-300 py-4">
                                <div className="flex items-center">
                                    {/* Placeholder for image or meal group */}
                                    {order.orderItems.length === 1 ? (
                                        <div className="relative mr-4 flex-shrink-0 rounded-lg bg-gray-200 h-20 w-20 shadow">
                                            <img
                                                src={order.orderItems[0].imageUrl}
                                                alt={order.orderItems[0].name}
                                                className="h-20 w-20 object-cover rounded-lg"
                                            />
                                            {order.orderItems[0].quantity > 0 && (
                                                <div className="absolute left-0 top-0 flex h-10 w-12 items-center justify-center rounded-br-lg rounded-tl-lg bg-primary text-lg text-white">
                                                    {order.orderItems[0].quantity}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative grid grid-cols-2 gap-1 w-20 h-20 rounded-lg shadow p-2 mr-4 bg-gray-200">
                                            {order.orderItems.slice(0, 4).map((item, index) => (
                                                <img
                                                    key={index}
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-8 h-8 object-cover rounded-md"
                                                />
                                            ))}
                                            {/* Fill empty grid spaces if less than 4 items */}
                                            {Array.from({ length: 4 - order.orderItems.slice(0, 4).length }).map((_, index) => (
                                                <div key={index} className="w-8 h-8 bg-gray-200 rounded-md"></div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <h4 className="font-semibold">Porudžbina #123456{/* Placeholder for order number */}</h4>
                                        </div>
                                        <p className="text-sm text-grey-500"><span className="text-sm text-blue-500">{totalPrice.toFixed(2)} RSD</span> | {description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <button onClick={() => console.log('Rate Order')} className="border border-primary text-primary px-4 py-2 rounded">
                                    Oceni
                                </button>
                                <button onClick={() => console.log('Reorder')} className="bg-primary text-white px-4 py-2 rounded">
                                    Naruči ponovo
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};