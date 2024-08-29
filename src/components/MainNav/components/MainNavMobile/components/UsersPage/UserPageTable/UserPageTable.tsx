import { readUsers } from '@/api/users/repository/hooks/readUsers'
import { Loader } from '@/components'
import { CheckCircle } from 'lucide-react'
import { DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { useCallback, useEffect, useState, useRef, CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { ReadUserResponse } from '@/api/users';

export type UserPageTableProps = {
    toggleRefresh: boolean // switches between true and false to trigger a refresh
    companyCode: string
    selectedRole: string
    selectedPermission: string
    onEditUser: (user: ReadUserResponse) => void; // New prop for editing user
}

export const UserPageTable = ({ toggleRefresh, companyCode, selectedRole, selectedPermission, onEditUser }: UserPageTableProps) => {
    const [usersData, setUsersData] = useState<ReadUserResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState(0)  // Start from page 0
    const [hasMore, setHasMore] = useState(true)
    const [listHeight, setListHeight] = useState(0) // Start with 0
    const parentRef = useRef(null) // Reference to the parent container

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        const roleFilter = selectedRole !== 'All' ? selectedRole : undefined
        const permissionFilter = selectedPermission !== 'All' ? selectedPermission === 'true' : undefined

        try {
            const res = await readUsers({
                path: { companyCode },
                query: {
                    pagination: { ...DEFAULT_OFFSET_PAGINATION_REQUEST, page }, // Using the correct page value
                    filter: { role: roleFilter, aLaCardPermission: permissionFilter },
                }
            })

            if (res.results && res.results.length > 0) {
                // If page is 0, reset data, otherwise append to it
                setUsersData(prev => page === 0 ? res.results : [...prev, ...res.results.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id))]) // Prevent duplicate data
                setHasMore(res.results.length >= DEFAULT_OFFSET_PAGINATION_REQUEST.size); // Check if there's more data
            } else {
                setHasMore(false)  // No more data to load
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false)
        }
    }, [selectedRole, selectedPermission, companyCode, page])

    useEffect(() => {
        // Reset page and data when filters change
        setPage(0);
        setUsersData([]);
        setHasMore(true); // Reset hasMore to true when filters change
    }, [selectedRole, selectedPermission])


    useEffect(() => {
        setPage(0);
        setUsersData([]);
        setHasMore(true);
    }, [toggleRefresh])

    useEffect(() => {
        fetchUsers();  // Fetch new data whenever page changes or filters are reset
    }, [page, fetchUsers])

    // Function to adjust the list height based on viewport height minus any fixed headers, footers, etc.
    useEffect(() => {
        const calculateHeight = () => {
            if (parentRef.current) {
                const offset = 230; // Adjust this value based on the layout (header, filter menu, add button)
                const height = window.innerHeight - offset;
                setListHeight(height);
            }
        };

        calculateHeight();
        window.addEventListener('resize', calculateHeight);

        return () => window.removeEventListener('resize', calculateHeight);
    }, [parentRef])

    const loadMoreItems = useCallback(() => {
        if (hasMore && !isLoading) {
            setPage(prevPage => prevPage + 1)
        }
    }, [hasMore, isLoading])

    const isItemLoaded = (index: number) => !hasMore || index < usersData.length

    const Row = ({ index, style }: {index: number, style: CSSProperties }) => {
        const user = usersData[index];
        if (!user) {
            return <div style={style} className="flex items-center justify-center py-4"><Loader /></div>;
        }

        return (
            <div 
                style={style} 
                key={user.id} 
                className="flex items-center justify-between py-4 bg-white border-b pr-4 cursor-pointer"
                onClick={() => onEditUser(user)} // Handle click to edit the user
            >
                <div className="flex flex-col">
                    <span className="text-lg font-semibold">{user.fullName}</span>
                    {user.role === 'Employee' && <span className="text-sm text-gray-500">Radnik</span>}
                    {user.role === 'CompanyManager' && <span className="text-sm text-gray-500">Menadžer</span>}
                </div>
                {user.aLaCardPermission && (
                    <CheckCircle className='text-green-500' size={24} />
                )}
            </div>
        )
    }

    return (
        <div ref={parentRef} className="relative" style={{ height: `${listHeight}px`, marginBottom: '50px' }}>
            <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={hasMore ? usersData.length + 1 : usersData.length} // Adjust itemCount if more data is expected
                loadMoreItems={loadMoreItems}
            >
                {({ onItemsRendered, ref }: {onItemsRendered: any, ref: any}) => (
                    <List
                        height={listHeight}  // Dynamic height based on calculation
                        itemCount={usersData.length}  // Total number of items
                        itemSize={70}  // Height of each row in pixels
                        width={'100%'}  // Full width of the container
                        onItemsRendered={onItemsRendered}
                        ref={ref}
                    >
                        {Row}
                    </List>
                )}
            </InfiniteLoader>
        </div>
    );
};
