import { ReadMyOrderResponse } from '@/api/order'
import { useReadMyOrders } from '@/api/order/repository/hooks/readMyOrder'
import { calculateDateRange, getOrderStateLabel } from '@/app/(protected)/employee/companies/[companyCode]/utils'
import { Loader } from '@/components/Loader'
import { getToLocalISOString } from '@/utils/date'
import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReadOnlyCart from '../../ReadOnlyCart/ReadOnlyCart'

export const OrderHistory = () => {
    const { from, to } = calculateDateRange(getToLocalISOString(new Date()), -30)
    const { companyCode } = useParams<{ companyCode: string }>()

    const [selectedOrder, setSelectedOrder] = useState<ReadMyOrderResponse | null>(null)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const {
        data: orderHistory,
        isFetching,
        refetch,
        isRefetching
    } = useReadMyOrders({
        path: { companyCode },
        query: {
            filter: {
                fromDate: to,
                toDate: from,
                orderStates: ['Confirmed', 'Cancelled'].join(','),
                orderTypes: ['Scheduled', 'Immediate'].join(',')
            }
        },
        options: { enabled: false }
    })

    useEffect(() => {
        refetch()
    }, [refetch])

    const getOrderSummary = (order: ReadMyOrderResponse) => {
        const number = order.number
        const forDate = order.orderDate
        const placedAt = order.placedAt
        const confirmedAt = order.confirmedAt
        const concatDescription = order.orderItems.map(item => `${item.name} x${item.quantity}`).join(', ')
        const description = concatDescription.length > 50 ? `${concatDescription.slice(0, 50)}...` : concatDescription
        const totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        return { description, totalPrice, forDate, placedAt, confirmedAt, number }
    }

    const handleSelectOrder = (order: ReadMyOrderResponse) => {
        setSelectedOrder(order) // Set the selected order
        setIsCartOpen(true) // Open the cart
    }

    const handleCloseCart = () => {
        setIsCartOpen(false) // Close the cart
        setSelectedOrder(null) // Clear the selected order
    }

    return (
        <div className='relative mt-6'>
            {(isFetching || isRefetching) && <Loader className='flex min-h-[50vh] items-center justify-center' />}
            {!isFetching &&
                !isRefetching &&
                orderHistory?.map(order => {
                    const { description, totalPrice, forDate, placedAt, confirmedAt, number } = getOrderSummary(order)
                    return (
                        <div
                            key={order.id}
                            className='mb-4 cursor-pointer bg-white'
                            onClick={() => handleSelectOrder(order)} // Pass the entire order to ReadOnlyCart
                        >
                            <div className='mb-2 flex flex-row gap-8'>
                                <p className='text-md text-black-900 font-medium'>Status:</p>
                                <p
                                    className={clsx('text-md font-bold', {
                                        'text-[#2F80ED]/75': order.state === 'Draft',
                                        'text-[#2F80ED]': order.state === 'Placed',
                                        'text-[#27AE60]': order.state === 'Confirmed',
                                        'text-[#EB5757]': order.state === 'Cancelled'
                                    })}>
                                    {getOrderStateLabel(order.state)}
                                </p>
                            </div>
                            <div className='border-grey-300 flex items-center justify-between border-t py-4'>
                                <div className='flex items-center gap-4'>
                                    {order.orderItems.length === 1 ? (
                                        <div className='relative h-20 w-20 flex-shrink-0 rounded-lg bg-gray-200 shadow'>
                                            <img
                                                src={order.orderItems[0].imageUrl}
                                                alt={order.orderItems[0].name}
                                                className='h-20 w-20 rounded-lg object-cover'
                                            />
                                        </div>
                                    ) : (
                                        <div className='relative grid h-20 w-20 flex-shrink-0 grid-cols-2 gap-1 rounded-lg bg-gray-200 p-2 shadow'>
                                            {order.orderItems.slice(0, 4).map((item, index) => (
                                                <div key={index} className='h-8 w-8'>
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className='h-full w-full rounded-md object-cover'
                                                    />
                                                </div>
                                            ))}
                                            {Array.from({ length: 4 - order.orderItems.slice(0, 4).length }).map(
                                                (_, index) => (
                                                    <div key={index} className='h-8 w-8 rounded-md bg-gray-200'></div>
                                                )
                                            )}
                                        </div>
                                    )}
                                    <div className='flex flex-col'>
                                        <div className='flex items-center'>
                                            <h4 className='font-semibold'>Porudžbina #{number}</h4>
                                        </div>
                                        <p className='text-grey-500 text-sm'>
                                            <span className='text-sm text-blue-500'>{totalPrice.toFixed(2)} RSD</span> |{' '}
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

            {isCartOpen && (
                <ReadOnlyCart
                    order={selectedOrder} // Pass the selected order as a prop
                    isOpen={isCartOpen}
                    onClose={handleCloseCart} // Pass the onClose handler to close the cart
                />
            )}
        </div>
    )
}
