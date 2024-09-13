'use client';

import { ReadOrderResponse } from '@/api/order';
import { readScheduledOrders } from '@/api/order/repository/hooks/readScheduledOrders';
import { useReadShifts } from '@/api/shifts';
import { ImmediateOrderDetails, ScheduledOrderDetails } from '@/app/(protected)/newstate';
import { DataTable } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathParams } from '@/hooks';
import { OffsetPagination } from '@/packages/components';
import { OffsetPaginationRequest } from '@/packages/types';
import { DateLocalIso } from '@/types';
import { formatTimeWithoutSeconds, getToLocalISOString } from '@/utils/date';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export const OrdersList = () => {
    const { companyCode } = usePathParams<{ companyCode: string }>()
    const [ordersData, setOrdersData] = useState<ReadOrderResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string| null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [selectedShift, setSelectedShift] = useState<string | null>(null); // Shift filter state
    const [selectedState, setSelectedState] = useState<string | null>(null); // Order state filter state
    const activeDay = getToLocalISOString(new Date()).split('T')[0] as DateLocalIso;
    const { data: shifts } = useReadShifts({path: { companyCode }});

    useEffect(() => {
        const fetchOrders = async () => {
            const shift = selectedShift !== 'All' ? selectedShift : undefined;
            const state = selectedState !== 'All' ? selectedState : undefined;

            const res = await readScheduledOrders({
                path: { companyCode },
                query: {
                    pagination: { page: currentPage, size: pageSize },
                    filter: { 
                        forDate: activeDay, 
                        searchByNumber: debouncedSearchTerm,
                        shiftId: shift, // Add shift filter if selected
                        orderState: state,   // Add order state filter if selected
                    }
                },
            });
            setOrdersData(res.results || []);
            setTotalCount(res.totalCount || 0);
        };

        fetchOrders();
    }, [pageSize, currentPage, debouncedSearchTerm, selectedShift, selectedState]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // Delay in milliseconds

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const sortedShifts = shifts?.slice().sort(
        (a, b) =>
            new Date(`1970-01-01T${a.shiftStartAt}`).getTime() -
            new Date(`1970-01-01T${b.shiftStartAt}`).getTime()
    );

    const columnHelper = createColumnHelper<ReadOrderResponse | ImmediateOrderDetails | ScheduledOrderDetails>();
    const columns = useMemo(() => [
        columnHelper.accessor('number', {
            header: "Broj porudžbine",
            cell: info => <strong>{info.getValue()}</strong>,
        }),
        columnHelper.accessor('orderDate', {
            header: 'Datum',
            cell: info => <strong>{info.getValue()}</strong>
        }),
        columnHelper.accessor('orderedForShiftId', {
            header: 'Smena',
            cell: info => {
                const shift = shifts?.find(shift => shift.id === info.getValue());
                const shiftStartTime = shift ? formatTimeWithoutSeconds(shift?.shiftStartAt) : undefined;
                const shiftEndTime = shift ? formatTimeWithoutSeconds(shift?.shiftEndAt) : undefined;
                return (
                    <strong>
                        {shift && `${shiftStartTime} - ${shiftEndTime}`}
                    </strong>
                )
            }
        }),
        columnHelper.accessor('orderItems', {
            header: 'Cena',
            cell: info => <strong>{`${info.getValue().reduce((total, item) => total + item.price * item.quantity, 0) || 0} RSD`}</strong>
        }),
        columnHelper.accessor('state', {
            header: 'Stanje',
            cell: info => <strong>{info.getValue()}</strong>
        }),
    ], [shifts]);

    const onPaginationChange = (newPagination: OffsetPaginationRequest): void => {
        setCurrentPage(newPagination.page);
        setPageSize(newPagination.size);
    };

    const resetFilters = () => {
        setSearchTerm(null);
        setDebouncedSearchTerm(null);
        setSelectedShift(null);
        setSelectedState(null);
        setCurrentPage(0); // Reset pagination as well
    };

    return (
        <div>
            <div className='flex flex-row w-full h-20 px-4 py-4 mb-4 items-center gap-4 bg-white sticky top-0 z-50 shadow-md'>
                <Input 
                    placeholder='Pretraži po broju porudžbine' 
                    className='w-60 bg-gray-100' 
                    icon={<SearchIcon />} 
                    iconPosition='right'
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    value={searchTerm || ''} />

                {/* Shift Filter */}
                <Select
                    onValueChange={value => setSelectedShift(value)}
                    value={selectedShift || ''}>
                    <SelectTrigger>
                        <SelectValue placeholder='Izaberi smenu' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>Sve</SelectItem>
                        {sortedShifts?.map(shift => (
                            <SelectItem key={shift.id} value={shift.id}>
                                {`${formatTimeWithoutSeconds(shift.shiftStartAt)} - ${formatTimeWithoutSeconds(shift.shiftEndAt)}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Order State Filter */}
                <Select
                    onValueChange={value => setSelectedState(value)}
                    value={selectedState || ''}>
                    <SelectTrigger>
                        <SelectValue placeholder='Izaberi status porudžbine' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>Sve</SelectItem>
                        <SelectItem value='Confirmed'>Potvrđeno</SelectItem>
                        <SelectItem value='Cancelled'>Otkazano</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset Button */}
                <Button onClick={resetFilters}>
                    Poništi
                </Button>
            </div>

            <div className='px-4 overflow-y-auto'>
                <DataTable columns={columns as ColumnDef<ReadOrderResponse, unknown>[]} data={ordersData} />

                <div className='flex flex-row py-4 items-center justify-between'>
                    <div className='flex w-16 justify-end'>
                        <Select
                            onValueChange={value => {
                                setPageSize(Number(value))
                                setCurrentPage(0) // Reset to first page when page size changes
                            }}
                            value={String(pageSize)}>
                            <SelectTrigger>
                                <SelectValue placeholder='Orders per page' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='10'>10</SelectItem>
                                <SelectItem value='25'>25</SelectItem>
                                <SelectItem value='50'>50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <OffsetPagination 
                        pagination={{
                            page: currentPage,
                            size: pageSize
                        }} 
                        totalCount={totalCount}
                        onPaginationChange={onPaginationChange}
                        showBoundaryPages={true}
                        visiblePages={5} />
                </div>
            </div>
        </div>
    );
};
