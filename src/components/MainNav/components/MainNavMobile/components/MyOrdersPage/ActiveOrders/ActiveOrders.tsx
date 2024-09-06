import { ReadMyOrderResponse } from '@/api/order'
import { useReadMyOrders } from '@/api/order/repository/hooks/readMyOrder'
import { calculateDateRange, getOrderStateLabel } from '@/app/(protected)/companies/[companyCode]/utils'
import { useCartStore } from '@/app/(protected)/newstate'
import { Loader } from '@/components/Loader'
import { formatEuropeanDate, getToLocalISOString } from '@/utils/date'
import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const ActiveOrders = () => {
    const { from, to } = calculateDateRange(getToLocalISOString(new Date(Date.now())), 2)
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

    const { setSelectedOrderById, clearSelectedOrder, isOpen, setIsOpen, setActiveShift } = useCartStore()

    useEffect(() => {
        if (!isOpen) {
            refetch()
            clearSelectedOrder()
            setActiveShift(undefined)
        }
    }, [isOpen])

    const getOrderSummary = (order: ReadMyOrderResponse) => {
        const number = order.state === 'Draft' ? '' : `#${order.number}`
        const forDate = order.orderDate
        const type = order.type
        const concatDescription = order.orderItems.map(item => `${item.name} x${item.quantity}`).join(', ')
        const description = concatDescription.length > 50 ? `${concatDescription.slice(0, 50)}...` : concatDescription
        const totalPrice = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        return { description, totalPrice, number, type, forDate }
    }

    const handleViewOrder = (orderId: string) => {
        setSelectedOrderById(orderId) // Set the selected order
        setIsOpen(true) // Open the cart with the selected order
    }

    return (
        <div className='relative mt-6'>
            {(isFetching || isRefetching) && <Loader className='flex min-h-[50vh] items-center justify-center' />}
            {!isFetching && !isRefetching && activeOrders?.length === 0 && (
                <div className='flex items-center justify-center min-h-[50vh]'>
                    <p className='text-md text-gray-700 text-center'>Nemate aktivnih porudžbina.</p>
                </div>
            )}
            {!isFetching &&
                !isRefetching &&
                activeOrders
                    ?.sort((a, b) => +b.created - +a.created)
                    .map(order => {
                        const { description, totalPrice, number, type, forDate } = getOrderSummary(order)
                        return (
                            <div key={order.id} className='mb-4 bg-white'>
                                <div className='mb-2 flex flex-row gap-8'>
                                    <p className='text-md text-gray-700 font-medium'>Status:</p>
                                    <p
                                        className={clsx('text-md font-bold', {
                                            'text-[#2F80ED]/75': order.state === 'Draft',
                                            'text-[#2F80ED]': order.state === 'Placed',
                                            'text-[#27AE60]': order.state === 'Confirmed',
                                            'text-[#EB5757]': order.state === 'Cancelled'
                                        })}>
                                        {getOrderStateLabel(order.state)}
                                    </p>
                                    {type === 'Immediate' && <p className='text-md text-gray-700 font-medium'>Za odmah</p>}
                                    {type === 'Scheduled' && (
                                        <p className='text-md text-gray-700 font-medium'>Za {formatEuropeanDate(forDate)}</p>
                                    )}
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
                                                <h4 className='font-semibold text-gray-700'>Porudžbina {number}</h4>
                                            </div>
                                            <p className='text-gray-500 text-sm'>
                                                <span className='text-sm text-blue-500'>{totalPrice.toFixed(2)} RSD</span> |{' '}
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 flex items-center justify-between'>
                                    <button
                                        onClick={() => handleViewOrder(order.id)}
                                        className='rounded bg-primary px-4 py-2 text-white'>
                                        Idi na porudžbinu
                                    </button>
                                    {order.type === 'Scheduled' && (order.state === 'Draft' || order.state === 'Placed') && (
                                        <button
                                            onClick={() => handleViewOrder(order.id)}
                                            className='rounded border border-primary px-4 py-2 text-primary'>
                                            Otkaži
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
        </div>
    )
}
