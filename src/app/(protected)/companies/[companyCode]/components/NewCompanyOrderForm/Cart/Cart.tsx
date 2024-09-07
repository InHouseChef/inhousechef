import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/app/(protected)/newstate';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CartMainCourseDrawer } from '../CartMainCourseDrawer/CartMainCourseDrawer';
import { CartSideDishDrawer } from '../CartSideDishDrawer/CartSideDishDrawer';
import { X } from 'lucide-react'; // Icon for the close button
import { formatEuropeanDate } from '@/utils/date';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { OrderDetails } from './OrderDetails/OrderDetails';
import emptyCart from '../../../../../../../../public/images/empty-cart.png';

const Cart = () => {
    const { 
        selectedOrder, 
        addOrUpdateOrder, 
        cancelOrder, 
        placeOrder, 
        isOpen, 
        setIsOpen, 
        regularShifts, 
        aLaCarteShift, 
        shouldDisableOrder } = useCartStore();
    const [isMainCourseDrawerOpen, setIsMainCourseDrawerOpen] = useState(false);
    const [isSideDishDrawerOpen, setIsSideDishDrawerOpen] = useState(false);
    const [isPlaceOrderLoading, setIsPlaceOrderLoading] = useState(false);
    const [isCancelOrderLoading, setIsCancelOrderLoading] = useState(false);
    const [isShiftValid, setIsShiftValid] = useState(true);
    const [isCancelingOrderModalOpen, setIsCancelingOrderModalOpen] = useState(false);

    useEffect(() => {
        if (selectedOrder) {
            validateShift();
        }
    }, [selectedOrder]);

    const handleOrderItemDecrease = (skuId: string, quantity: number) => {
        const totalQuantity = selectedOrder?.orderItems.reduce((total, item) => total + item.quantity, 0) || 0;
        if (totalQuantity === 1) {
            setIsCancelingOrderModalOpen(true);
        } else {
            addOrUpdateOrder(skuId, quantity);
        }
    }

    const handleAddOrUpdateOrder = (skuId: string, quantity: number) => {
        addOrUpdateOrder(skuId, quantity);
    }

    const handleCancelOrder = () => {
        setIsCancelOrderLoading(true);
        cancelOrder()
            .finally(() => {
                setIsOpen(false);
                setIsCancelOrderLoading(false)
                setIsCancelingOrderModalOpen(false);
            });
    };

    const handlePlaceOrder = () => {
        setIsPlaceOrderLoading(true);
        placeOrder()
            .finally(() => {
                setIsOpen(false);
                setIsPlaceOrderLoading(false)
            });
    };

    const isOrderDisabled = shouldDisableOrder(selectedOrder);

    const validateShift = () => {
        const currentDate = new Date();

        if (selectedOrder?.type === 'Scheduled') {
            //@ts-ignore
            const shift = regularShifts.find(shift => shift.id === selectedOrder?.orderedForShiftId);
            if (shift) {
                // Calculate the shift start time on the order date
                const shiftStartTime = new Date(`${selectedOrder.orderDate}T${shift.shiftStartAt}`);
                // Calculate the deadline for placing the order
                const orderDeadlineTime = new Date(
                    shiftStartTime.getTime() - shift.orderingDeadlineBeforeShiftStart * 60 * 60 * 1000
                );
                // Validate whether the current time is before the order deadline
                setIsShiftValid(currentDate < orderDeadlineTime);
            }
        } else if (selectedOrder?.type === 'Immediate') {
            if (aLaCarteShift) {
                // Calculate the shift start time and end time on the order date
                const shiftStartTime = new Date(`${selectedOrder.orderDate}T${aLaCarteShift.shiftStartAt}`);
                const shiftEndTime = new Date(`${selectedOrder.orderDate}T${aLaCarteShift.shiftEndAt}`);
                // Validate whether the current time is within the a la carte shift window
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
    const serbianLocale = 'sr-RS';
    if (selectedOrder?.type === 'Immediate') {
        const shiftStartTime = new Date(`${selectedOrder.orderDate}T${aLaCarteShift?.shiftStartAt}`);
        const shiftEndTime = new Date(`${selectedOrder.orderDate}T${aLaCarteShift?.shiftEndAt}`);

        const details = <OrderDetails 
            number={selectedOrder.number}
            orderDate={selectedOrder.orderDate}
            shiftStart={aLaCarteShift?.shiftStartAt}
            shiftEnd={aLaCarteShift?.shiftEndAt} />

        if (selectedOrder.state === 'Draft') {
            message = (
                <>
                    {details}
                    <div className="p-4 bg-yellow-100 rounded-md text-center text-sm text-yellow-700">
                        <p>Ovu započetu porudžbinu možete poručiti dok traje "A La Carte" smena za današnji dan</p>
                        <p>od <strong>{shiftStartTime.toLocaleTimeString(serbianLocale)}</strong> do <strong>{shiftEndTime.toLocaleTimeString(serbianLocale)}</strong></p>
                        <p>Nakon tog perioda porudžbina će biti automatski odbačena.</p>
                    </div>
                </>
            );
        } else if (selectedOrder.state === 'Placed' || selectedOrder.state === 'Confirmed') {
            message = (
                <>
                    {details}
                    <div className="p-4 bg-blue-100 rounded-md text-center text-sm text-blue-700">
                        <p>Vaša porudžbina je poručena i više ne može biti izmenjena.</p>
                        <p>Biće poslužena u naredna <strong>dva sata</strong>.</p>
                    </div>
                </>
            );
        }
    } else if (selectedOrder?.type === 'Scheduled') {
        //@ts-ignore
        const shift = regularShifts.find(shift => shift.id === selectedOrder?.orderedForShiftId);
    
        if (shift) {
            const shiftStartTime = new Date(`${selectedOrder.orderDate}T${shift.shiftStartAt}`);
            const orderDeadlineTime = new Date(
                shiftStartTime.getTime() - shift.orderingDeadlineBeforeShiftStart * 60 * 60 * 1000
            );

            const details = <OrderDetails 
                number={selectedOrder.number}
                orderDate={selectedOrder.orderDate}
                shiftStart={shift.shiftStartAt}
                shiftEnd={shift.shiftEndAt} />

            if (selectedOrder.state === 'Draft') {
                message = (
                    <>
                        {details}
                        <div className="p-4 bg-yellow-100 rounded-md text-center text-sm text-yellow-700">
                            <p>Ovu započetu porudžbinu možete poručiti do </p>
                            <p><strong>{formatEuropeanDate(new Date(selectedOrder.orderDate))}</strong> <strong>{orderDeadlineTime.toLocaleTimeString(serbianLocale)}</strong></p>
                            <p>Nakon tog vremena, porudžbina će biti automatski odbačena.</p>
                        </div>
                    </>
                );
            } else if (selectedOrder.state === 'Placed') {
                message = (
                    <>
                        {details}
                        <div className="p-4 bg-blue-100 rounded-md text-center text-sm text-blue-700">
                            <p>Vaša porudžbina je poručena i može se izmeniti do</p>
                            <p><strong>{formatEuropeanDate(new Date(selectedOrder.orderDate))}</strong> <strong>{orderDeadlineTime.toLocaleTimeString(serbianLocale)}</strong></p>
                            <p>Nakon toga, porudžbina će biti zaključana i poslužena u izabranom periodu.</p>
                        </div>
                    </>
                );
            }
        }
    }

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

                    {mainCourses.length === 0 && sideDishes.length === 0 && (
                        <>
                            <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto rounded-md">
                                <div className="mb-6 mt-5">
                                    <img src={emptyCart.src} alt="Empty Cart" className="w-48 h-auto mx-auto" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">Vaša korpa je prazna</h1>
                                <p className="text-md text-gray-600 mb-6 text-center">
                                    Kad dodate jela sa glavnog menija ona će se prikazati ovde kako biste mogli lakše da pravite izmene.
                                </p>
                                <button
                                    className="bg-primary text-white text-sm px-4 py-2 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Počnite sa poručivanjem
                                </button>
                                </div>
                        </>
                    )}

                    {(mainCourses.length !== 0 || sideDishes.length !== 0) && (
                        <>
                            <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                                {/* Main Courses Section */}
                                {message}

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Glavna jela</h3>
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
                                                                onClick={() => handleOrderItemDecrease(item.skuId, -1)}
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
                                                                onClick={() => handleAddOrUpdateOrder(item.skuId, 1)}
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
                                            className="mt-2 text-gray-900"
                                            onClick={() => setIsMainCourseDrawerOpen(true)}
                                            disabled={!isShiftValid}
                                        >
                                            Dodaj još glavnih jela
                                        </Button>
                                    )}
                                </div>

                                {/* Side Dishes Section */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Prilozi</h3>
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
                                                                onClick={() => handleOrderItemDecrease(item.skuId, -1)}
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
                                                                onClick={() => handleAddOrUpdateOrder(item.skuId, 1)}
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
                                            className="mt-2 text-gray-700"
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
                        </>
                    )}


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

            <AlertDialog open={isCancelingOrderModalOpen} onOpenChange={setIsCancelingOrderModalOpen}>
                <AlertDialogContent className='p-6 w-3/4 rounded-md'>
                    <AlertDialogTitle>Otkazivanje porudžbine</AlertDialogTitle>
                    <AlertDialogDescription className='mb-4'>
                        Ova akcija će dovesti do otkazivanja porudžbine. Da li ste sigurni da želite da nastavite?
                    </AlertDialogDescription>

                    <div className='flex justify-end items-center gap-4'>
                        <AlertDialogCancel asChild>
                            <Button className='mt-0' variant='secondary' onClick={() => setIsCancelingOrderModalOpen(false)}>
                                Otkaži
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button className='mt-0' onClick={handleCancelOrder}>Nastavi</Button>
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default Cart;
