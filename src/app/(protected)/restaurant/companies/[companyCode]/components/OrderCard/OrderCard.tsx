import { ReadOrderResponse } from '@/api/order';
import React from 'react';

interface OrderCardProps {
    order: ReadOrderResponse;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    return (
        <div className="bg-white p-4 shadow rounded">
            <h3>{order.customerId}</h3>
            {/* Display order details */}
            <p>{order.orderDate}</p>
            <div>
                <button className="btn btn-success mr-2">Confirm</button>
                <button className="btn btn-danger">Cancel</button>
            </div>
        </div>
    );
};

export default OrderCard;
