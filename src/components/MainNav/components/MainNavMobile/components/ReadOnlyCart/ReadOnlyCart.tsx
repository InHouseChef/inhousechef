import React from 'react';
import { ReadMyOrderResponse } from '@/api/order';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X } from 'lucide-react'; // Icon for the close button

interface ReadOnlyCartProps {
    order: ReadMyOrderResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

const ReadOnlyCart: React.FC<ReadOnlyCartProps> = ({ order, isOpen, onClose }) => {
    if (!order) return null;

    const mainCourses = order.orderItems
        .filter(item => item.type === 'MainCourse')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const sideDishes = order.orderItems
        .filter(item => item.type === 'SideDish')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const totalAmount = order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0) || 0;

    let message = <></>;
    if (order?.type === 'Immediate') {
        message = (
            <div className="p-4 bg-gray-100 text-center text-sm text-gray-700">
                Nakon što se odobri od strane restorana Vaša porudžbina će biti dostavljena u roku od <strong>dva sata</strong>.
            </div>
        );
    } else {
        message = (
            <div className="p-4 bg-gray-100 text-center text-sm text-gray-700">
                Vaša porudžbina će biti dostavljena u naredna <strong>dva sata</strong>.
            </div>
        );
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="w-full h-full bg-white flex flex-col">
                <SheetHeader className="flex justify-between items-center p-4 border-b">
                    <SheetTitle className="text-lg font-bold">Vaša porudžbina</SheetTitle>
                    <SheetClose asChild>
                        <button
                            className="text-gray-500 hover:text-gray-700 transition"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </SheetClose>
                </SheetHeader>

                {message}

                <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                    {/* Main Courses Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Glavna jela</h3>
                        {mainCourses.length > 0 ? (
                            <div className="space-y-2">
                                {mainCourses.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm flex-shrink-0">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.price} RSD</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-center font-mono">
                                            x{item.quantity.toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nema glavnih jela u vašoj porudžbini.</p>
                        )}
                    </div>

                    {/* Side Dishes Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Prilozi</h3>
                        {sideDishes.length > 0 ? (
                            <div className="space-y-2">
                                {sideDishes.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.price} RSD</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-center font-mono">
                                            x{item.quantity.toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Nema priloga u vašoj porudžbini.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white border-t mt-4 pt-4">
                    <p className="text-center text-gray-700 font-semibold">
                        Total: {totalAmount.toFixed(2)} RSD
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ReadOnlyCart;
