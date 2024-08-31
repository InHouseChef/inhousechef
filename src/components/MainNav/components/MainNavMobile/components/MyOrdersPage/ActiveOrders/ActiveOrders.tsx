import { ReadMyOrderResponse } from '@/api/order'
import { useReadMyOrders } from '@/api/order/repository/hooks/readMyOrder'
import { useCartStore } from '@/app/(protected)/employee/companies/[companyCode]/state'
import { calculateDateRange } from '@/app/(protected)/employee/companies/[companyCode]/utils'
import { Loader } from '@/components/Loader'
import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const ActiveOrders = () => {
    const { setActiveOrder, setIsOpenCart } = useCartStore()
    const { from, to } = calculateDateRange(new Date().toISOString(), 3)
    const { companyCode } = useParams<{ companyCode: string }>()

    const {
        data: activeOrders,
        refetch,
        isFetching,
        isRefetching
    } = useReadMyOrders({
        path: { companyCode },
        query: {
            filter: {
                fromDate: from,
                toDate: to,
                orderStates: ['Draft', 'Placed'].join(','),
                orderTypes: ['Scheduled', 'Immediate'].join(',')
            }
        },
        options: { enabled: false }
    })

    useEffect(() => {
        refetch()
    }, [refetch])

    const handleOrderClick = (order: ReadMyOrderResponse) => {
        // setActiveOrder(order)
        // setIsOpenCart(true)
    }

    const getOrderSummary = (order: ReadMyOrderResponse) => {
        const number = order.number
        const forDate = order.orderDate
        const placedAt = order.placedAt
        const confirmedAt = order.confirmedAt
        const concatDescription = order.orderItems.map(item => item.name).join(', ')
        const description = concatDescription.length > 50 ? `${concatDescription.slice(0, 50)}...` : concatDescription
        const totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        return { description, totalPrice, forDate, placedAt, confirmedAt, number }
    }

    return (
        <div className='mt-6'>
            {(isFetching || isRefetching) && <Loader />}
            {!isFetching &&
                !isRefetching &&
                activeOrders?.map(order => {
                    const { description, totalPrice, forDate, placedAt, confirmedAt, number } = getOrderSummary(order)
                    return (
                        <div key={order.id} className='mb-4 bg-white'>
                            <div className='mb-2 flex flex-row gap-8'>
                                <p className='text-md text-black-900 font-medium'>Status:</p>
                                <p
                                    className={clsx('text-md font-bold', {
                                        'text-[#2F80ED]/75': order.state === 'Draft',
                                        'text-[#2F80ED]': order.state === 'Placed',
                                        'text-[#27AE60]': order.state === 'Confirmed',
                                        'text-[#EB5757]': order.state === 'Cancelled'
                                    })}>
                                    {order.state}
                                </p>
                            </div>
                            <div className='border-grey-300 flex items-center justify-between border-t py-4'>
                                <div className='flex items-center'>
                                    {order.orderItems.length === 1 ? (
                                        <div className='relative mr-4 h-20 w-20 flex-shrink-0 rounded-lg bg-gray-200 shadow'>
                                            <img
                                                src={order.orderItems[0].imageUrl}
                                                alt={order.orderItems[0].name}
                                                className='h-20 w-20 rounded-lg object-cover'
                                            />
                                        </div>
                                    ) : (
                                        <div className='relative mr-4 grid h-20 w-20 grid-cols-2 gap-1 rounded-lg bg-gray-200 p-2 shadow'>
                                            {order.orderItems.slice(0, 4).map((item, index) => (
                                                <img
                                                    key={index}
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className='h-8 w-8 rounded-md object-cover'
                                                />
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
                            <div className='mt-4 flex items-center justify-between'>
                                <button
                                    onClick={() => handleOrderClick(order)}
                                    className='rounded bg-primary px-4 py-2 text-white'>
                                    Idi na porudžbinu
                                </button>
                                <button
                                    onClick={() => console.log('Cancel Order')}
                                    className='rounded border border-primary px-4 py-2 text-primary'>
                                    Otkaži
                                </button>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}
