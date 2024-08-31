import { useCartStore } from '@/app/(protected)/employee/newstate';
import React from 'react';

const Cart: React.FC = () => {
    const selectedOrder = useCartStore(state => state.selectedOrder);
    const updateOrder = useCartStore(state => state.updateOrder);
    const cancelOrder = useCartStore(state => state.cancelOrder);
    const confirmOrder = useCartStore(state => state.confirmOrder);

    const handleIncreaseQuantity = (mealId: string) => {
        if (selectedOrder) {
            const updatedOrderItems = selectedOrder.orderItems.map(orderItem =>
                orderItem.skuId === mealId ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
            );
            updateOrder(selectedOrder.id, updatedOrderItems);
        }
    };

    const handleDecreaseQuantity = (mealId: string) => {
        if (selectedOrder) {
            const updatedMeals = selectedOrder.meals
                .map(meal =>
                    meal.id === mealId && meal.quantity > 1 ? { ...meal, quantity: meal.quantity - 1 } : meal
                )
                .filter(meal => meal.quantity > 0);
            updateOrder(selectedOrder.id, updatedMeals);
        }
    };

    const handleCancelOrder = () => {
        if (selectedOrder) {
            cancelOrder(selectedOrder.id);
        }
    };

    const handlePlaceOrder = () => {
        if (selectedOrder && selectedOrder.state === 'Draft') {
            confirmOrder(selectedOrder.id);
        }
    };

    if (!selectedOrder) {
        return <div>No active orders.</div>;
    }

    return (
        <div>
            <h3>Cart</h3>
            {selectedOrder.meals.map(meal => (
                <div key={meal.id}>
                    <img src={meal.imageUrl} alt={meal.name} />
                    <div>{meal.name}</div>
                    <div>
                        <button onClick={() => handleDecreaseQuantity(meal.id)}>-</button>
                        <span>{meal.quantity}</span>
                        <button onClick={() => handleIncreaseQuantity(meal.id)}>+</button>
                    </div>
                    <div>{meal.price}</div>
                </div>
            ))}
            <div>
                <button onClick={handleCancelOrder}>Cancel Order</button>
                {selectedOrder.state === 'Draft' && (
                    <button onClick={handlePlaceOrder}>Place Order</button>
                )}
            </div>
        </div>
    );
};

export default Cart;
