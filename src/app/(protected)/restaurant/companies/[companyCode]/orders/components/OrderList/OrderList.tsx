'use client';

import { ReadOrderResponse } from '@/api/order';
import { readScheduledOrders } from '@/api/order/repository/hooks/readScheduledOrders';
import { useReadShifts } from '@/api/shifts';
import { ImmediateOrderDetails, ScheduledOrderDetails } from '@/app/(protected)/newstate';
import { DataTable } from '@/components';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants';
import { usePathParams } from '@/hooks';
import { cn } from '@/lib/utils';
import { OffsetPagination, TablePlaceholder } from '@/packages/components';
import { OffsetPaginationRequest } from '@/packages/types';
import { formatEuropeanDate, formatTimeWithoutSeconds, getSerbianLocalDateTime, getToLocalISOString } from '@/utils/date';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export const OrdersList = () => {
    const { companyCode } = usePathParams<{ companyCode: string }>()
    const [ordersData, setOrdersData] = useState<ReadOrderResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string| null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_OFFSET_PAGINATION_REQUEST.size);
    const [currentPage, setCurrentPage] = useState<number>(DEFAULT_OFFSET_PAGINATION_REQUEST.page);
    const [selectedShift, setSelectedShift] = useState<string | null>(null); // Shift filter state
    const [selectedState, setSelectedState] = useState<string | null>(null); // Order state filter state
    const { data: shifts } = useReadShifts({path: { companyCode }});
    const [date, setDate] = useState<Date>(new Date())
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            const shift = selectedShift !== 'All' ? selectedShift : undefined;
            const state = selectedState !== 'All' ? selectedState : undefined;
            const formattedDate = date ? getToLocalISOString(date).split('T')[0] : undefined;

            setIsFetching(true);
            const res = await readScheduledOrders({
                path: { companyCode },
                query: {
                    pagination: { page: currentPage, size: pageSize },
                    filter: { 
                        forDate: formattedDate, 
                        searchByNumber: debouncedSearchTerm,
                        shiftId: shift, // Add shift filter if selected
                        orderState: state,   // Add order state filter if selected
                    }
                },
            });
            setIsFetching(false);
            setOrdersData(res.results || []);
            setTotalCount(res.totalCount || 0);
        };

        fetchOrders();
    }, [pageSize, currentPage, debouncedSearchTerm, selectedShift, selectedState, date]);

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
            header: () => <div className='text-gray-900 font-bold'>Broj porudžbine</div>,
            cell: info => <div className='text-gray-500 font-bold'>#{info.getValue()}</div>,
        }),
        columnHelper.accessor('orderDate', {
            header: () => <div className='text-gray-900 font-bold'>Datum</div>,
            cell: info => <div className='text-gray-500 font-bold'>{formatEuropeanDate(info.getValue())}</div>
        }),
        columnHelper.accessor('orderedForShiftId', {
            header: () => <div className='text-gray-900 font-bold'>Smena</div>,
            cell: info => {
                const shift = shifts?.find(shift => shift.id === info.getValue());
                const shiftStartTime = shift ? formatTimeWithoutSeconds(shift?.shiftStartAt) : undefined;
                const shiftEndTime = shift ? formatTimeWithoutSeconds(shift?.shiftEndAt) : undefined;
                return (
                    <div className='text-gray-500 font-bold'>
                        {shift && `${shiftStartTime} - ${shiftEndTime}`}
                    </div>
                )
            }
        }),
        columnHelper.accessor('orderItems', {
            id: 'orderItemsForPrice',
            header: () => <div className='text-gray-900 font-bold'>Cena</div>,
            cell: info => <div className='text-gray-500 font-bold'>{`${info.getValue().reduce((total, item) => total + item.price * item.quantity, 0) || 0} RSD`}</div>
        }),
        columnHelper.accessor('state', {
            header: () => <div className='text-gray-900 font-bold'>Stanje</div>,
            cell: info => <div className='text-gray-500 font-bold'>{info.getValue()}</div>
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
        if (!date) {
            setDate(new Date());
        }
        setCurrentPage(DEFAULT_OFFSET_PAGINATION_REQUEST.page);
        setPageSize(DEFAULT_OFFSET_PAGINATION_REQUEST.size);
    };

    const handleDateSelection = (dates: Date[] | Date | undefined) => {
        setIsCalendarOpen(false);

        if (dates === undefined) {
            setDate(new Date())
            return
        }

        if (!Array.isArray(dates)) {
            setDate(dates)
            return
        }

        if (dates.length === 0) {
            setDate(new Date())
            return
        }

        setDate(dates[0])
    }

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

                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left text-sm gap-2",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="h-4 w-4" />
                            {<div className='w-20'>{date ? date.toLocaleDateString('sr-RS') : 'Izaberi datum'}</div>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelection}
                            initialFocus
                            />
                    </PopoverContent>
                </Popover>

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
                {isFetching && <TablePlaceholder />}
                {!isFetching && <DataTable columns={columns as ColumnDef<ReadOrderResponse, unknown>[]} data={ordersData} />}

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
