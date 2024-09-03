import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/app/(protected)/employee/newstate';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CartMainCourseDrawer } from '../CartMainCourseDrawer/CartMainCourseDrawer';
import { CartSideDishDrawer } from '../CartSideDishDrawer/CartSideDishDrawer';
import { X } from 'lucide-react'; // Icon for the close button

const Cart = () => {
    const { selectedOrder, addOrUpdateOrder, cancelOrder, placeOrder, isOpen, setIsOpen, regularShifts, aLaCarteShift, activeDay, shouldDisableOrder } = useCartStore();
    const [isMainCourseDrawerOpen, setIsMainCourseDrawerOpen] = useState(false);
    const [isSideDishDrawerOpen, setIsSideDishDrawerOpen] = useState(false);
    const [isPlaceOrderLoading, setIsPlaceOrderLoading] = useState(false);
    const [isCancelOrderLoading, setIsCancelOrderLoading] = useState(false);
    const [isShiftValid, setIsShiftValid] = useState(true);

    useEffect(() => {
        if (selectedOrder) {
            validateShift();
        }
    }, [selectedOrder]);

    const validateShift = () => {
        const currentDate = new Date();
        const activeDayDate = new Date(activeDay);
        const isSameDay = (date1: Date, date2: Date) =>
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
        const isToday = isSameDay(currentDate, activeDayDate);

        if (selectedOrder?.type === 'Scheduled') {
            // @ts-ignore
            const shift = regularShifts.find(shift => shift.id === selectedOrder?.orderedForShiftId);
            if (shift) {
                const shiftStartTime = new Date(`${activeDay}T${shift.shiftStartAt}`);
                const orderDeadlineTime = new Date(
                    shiftStartTime.getTime() - shift.orderingDeadlineBeforeShiftStart * 60 * 60 * 1000
                );
                setIsShiftValid(!(isToday && currentDate > orderDeadlineTime));
            }
        } else if (selectedOrder?.type === 'Immediate') {
            if (aLaCarteShift && isToday) {
                const shiftStartTime = new Date(`${activeDay}T${aLaCarteShift.shiftStartAt}`);
                const shiftEndTime = new Date(`${activeDay}T${aLaCarteShift.shiftEndAt}`);
                setIsShiftValid(currentDate >= shiftStartTime && currentDate <= shiftEndTime);
            } else {
                setIsShiftValid(false);
            }
        }
    };

    const mainCourses = selectedOrder?.orderItems
        .filter(item => item.type === 'MainCourse')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const sideDishes = selectedOrder?.orderItems
        .filter(item => item.type === 'SideDish')
        .sort((a, b) => a.name.localeCompare(b.name)) || [];

    const totalAmount = selectedOrder?.orderItems.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    const isDraft = selectedOrder?.state === 'Draft';

    let message = <></>;
    if (selectedOrder?.type === 'Immediate') {
        message = (
            <div className="p-4 bg-gray-100 text-center text-sm text-gray-700">
                Hvala Vam na porudžbini.
            </div>
        );
    } else {
        message = (
            <div className="p-4 bg-gray-100 text-center text-sm text-gray-700">
                Hvala Vam na porudžbini.
            </div>
        );
    }

    const handleCancelOrder = () => {
        setIsCancelOrderLoading(true);
        cancelOrder()
            .then(() => {
                setIsOpen(false);
            })
            .finally(() => setIsCancelOrderLoading(false));
    };

    const handlePlaceOrder = () => {
        setIsPlaceOrderLoading(true);
        placeOrder()
            .then(() => {
                setIsOpen(false);
            })
            .finally(() => setIsPlaceOrderLoading(false));
    };

    const isOrderDisabled = shouldDisableOrder(selectedOrder);

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    {selectedOrder && !isOrderDisabled && (
                        <Button
                            className="fixed bottom-4 left-8 right-8 py-3 bg-primary text-white font-semibold text-sm text-center rounded-lg z-50"
                            onClick={() => setIsOpen(true)}
                        >
                            Pregledaj porudžbinu - {totalAmount} RSD
                        </Button>
                    )}
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full h-full bg-white flex flex-col">
                    <SheetHeader className="flex justify-between items-center p-4 border-b">
                        <SheetTitle className="text-lg font-bold">Vaša porudžbina</SheetTitle>
                        <SheetClose asChild>
                            <button
                                className="text-gray-500 hover:text-gray-700 transition"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </SheetClose>
                    </SheetHeader>

                    {/* {message} */}

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
                                            <div className="flex items-center space-x-2 w-26">
                                                {isShiftValid && (
                                                    <button
                                                        onClick={() => addOrUpdateOrder(item.skuId, -1)}
                                                        className="flex-1 px-2 py-1 bg-gray-200 rounded text-center"
                                                        disabled={!isShiftValid}>
                                                        −
                                                    </button>
                                                )}
                                                <div className="flex-1 text-sm font-semibold text-center font-mono">
                                                    x{item.quantity.toString().padStart(2, '0')}
                                                </div>
                                                {isShiftValid && (
                                                    <button
                                                        onClick={() => addOrUpdateOrder(item.skuId, 1)}
                                                        className="flex-1 px-2 py-1 bg-gray-200 rounded text-center"
                                                        disabled={!isShiftValid}>
                                                        +
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">{isShiftValid ? 'Trenutno n' : 'N'}ema glavnih jela u vašoj porudžbini.</p>
                            )}
                            {isShiftValid && (
                                <Button
                                    variant="link"
                                    className="mt-2 text-primary"
                                    onClick={() => setIsMainCourseDrawerOpen(true)}
                                    disabled={!isShiftValid}
                                >
                                    Dodaj još glavnih jela
                                </Button>
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
                                            <div className="flex items-center space-x-2 w-26">
                                                {isShiftValid && (
                                                    <button
                                                        onClick={() => addOrUpdateOrder(item.skuId, -1)}
                                                        className="flex-1 px-2 py-1 bg-gray-200 rounded text-center"
                                                        disabled={!isShiftValid}>
                                                        −
                                                    </button>
                                                )}
                                                <div className="flex-1 text-sm font-semibold text-center font-mono">
                                                    x{item.quantity.toString().padStart(2, '0')}
                                                </div>
                                                {isShiftValid && (
                                                    <button
                                                        onClick={() => addOrUpdateOrder(item.skuId, 1)}
                                                        className="flex-1 px-2 py-1 bg-gray-200 rounded text-center"
                                                        disabled={!isShiftValid}>
                                                        +
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">{isShiftValid ? 'Trenutno n' : 'N'}ema priloga u vašoj porudžbini.</p>
                            )}
                            {isShiftValid && (
                                <Button
                                    variant="link"
                                    className="mt-2 text-primary"
                                    onClick={() => setIsSideDishDrawerOpen(true)}
                                    disabled={!isShiftValid}
                                >
                                    Dodaj još priloga
                                </Button>
                            )}  
                        </div>
                    </div>

                    <div className="bg-white border-t">
                        {isShiftValid ? (
                            <div className="flex flex-col space-y-2">
                                {isDraft ? (
                                    <>
                                        <Button
                                            onClick={handlePlaceOrder}
                                            loading={isPlaceOrderLoading}
                                            className="w-full py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition">
                                            Poruči - {totalAmount} RSD
                                        </Button>
                                        <Button
                                            onClick={handleCancelOrder}
                                            loading={isCancelOrderLoading}
                                            className="w-full py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
                                            Otkaži porudžbinu
                                        </Button>
                                    </>
                                ) : (
                                    selectedOrder?.type === 'Scheduled' && (
                                        <Button
                                            onClick={handleCancelOrder}
                                            loading={isCancelOrderLoading}
                                            className="w-full py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
                                            Otkaži porudžbinu
                                        </Button>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">Ovu porudžbinu ne možete menjati jer je isteklo vreme za izmene.</p>
                        )}
                    </div>


                </SheetContent>
            </Sheet>

            <CartMainCourseDrawer
                isOpen={isMainCourseDrawerOpen}
                onClose={() => setIsMainCourseDrawerOpen(false)}
            />
            <CartSideDishDrawer
                isOpen={isSideDishDrawerOpen}
                onClose={() => setIsSideDishDrawerOpen(false)}
            />
        </>
    );
};

export default Cart;
