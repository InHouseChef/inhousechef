import React from 'react';
import { ScheduledOrderDetails } from '@/app/(protected)/newstate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { OrderDetails } from '@/app/(protected)/companies/[companyCode]/components/NewCompanyOrderForm/Cart/OrderDetails/OrderDetails';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-select';
import { Shift } from '@/hooks/useShift';
import { ReadShiftResponse } from '@/api/shifts';

interface ScheduledOrderOverviewProps {
    order: ScheduledOrderDetails | undefined;
    isOpen: boolean;
    onClose: () => void;
    shifts: ReadShiftResponse[];
}

const ScheduledOrderOverview: React.FC<ScheduledOrderOverviewProps> = ({ order, isOpen, onClose, shifts }) => {
    if (!order) return null;

    const shift = shifts.find((shift) => shift.id === order.orderedForShiftId);
    const orderDetails = <OrderDetails 
        orderDate={order.orderDate} 
        shiftStart={shift?.shiftStartAt} 
        shiftEnd={shift?.shiftEndAt} />;

    const mainCourses = order?.orderItems
        .filter((item) => item.type === 'MainCourse')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const sideDishes = order?.orderItems
        .filter((item) => item.type === 'SideDish')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const orderItems = [...mainCourses, ...sideDishes];

    const total = order?.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent width='max-w-3xl' hideCloseButton={true}>
                <DialogHeader>
                    <DialogTitle>Porudžbina #{order.number}</DialogTitle>
                </DialogHeader>
                {orderDetails}
                <div className='border-b'></div>
                <div className="grid grid-cols-2 grid-rows-2 gap-8 py-4 border-b">
                    <div className="row-span-2 col-span-1 overflow-y-auto">
                        {orderItems.length > 0 && (
                                <div className="space-y-2 flex flex-col gap-4">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-white flex-shrink-0">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold text-sm">{item.name}</div>
                                                    <div className="text-xs text-gray-500">{item.price.toFixed(2)} RSD</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 w-26">
                                                <div className="flex-1 text-sm font-semibold text-center font-mono">
                                                    x{item.quantity.toString().padStart(2, '0')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                    
                    <div className="row-span-1 col-span-1">
                        Content 3
                    </div>
                    
                    <div className="row-span-1 col-span-1">
                        <div className="flex flex-col items-left py-3 flex-shrink-0">
                            <div className="font-semibold text-md text-gray-700 pb-4">Međuzbir</div>
                            {orderItems.map((item) => (
                                <div key={item.skuId} className='flex flex-row items-center justify-between mb-2'>
                                    <div className="font-normal text-sm">{item.name} x {item.quantity}</div>
                                    <div className="text-xs text-gray-500">{(item.price * item.quantity).toFixed(2)} RSD</div>
                                </div>
                            ))}
                            <div className='pt-2 border-t flex flex-row items-center justify-between'>
                                <div className="text-md font-bold text-gray-700">Ukupno:</div>
                                <div className="text-md font-bold text-gray-700">{total.toFixed(2)} RSD</div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <div className='flex flex-row justify-right items-center gap-4'>
                        <Button
                            className="w-40 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-black transition">
                            Isporučeno
                        </Button>
                        <Button
                            className="w-40 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition">
                            Neisporučeno
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduledOrderOverview;
