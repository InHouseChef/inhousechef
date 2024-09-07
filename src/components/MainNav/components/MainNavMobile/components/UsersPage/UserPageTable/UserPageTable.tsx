import { ReadUserResponse, useUpdateUserALaCardPermission } from '@/api/users';
import { readUsers } from '@/api/users/repository/hooks/readUsers';
import { DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants';
import { CheckCircle2Icon } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

export type UserPageTableProps = {
    toggleRefresh: boolean;
    companyCode: string;
    selectedRole: string;
    selectedPermission: string;
    onEditUser: (user: ReadUserResponse) => void;
};

export const UserPageTable = ({
    toggleRefresh,
    companyCode,
    selectedRole,
    selectedPermission,
    onEditUser,
}: UserPageTableProps) => {
    const [usersData, setUsersData] = useState<ReadUserResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [listHeight, setListHeight] = useState<number>(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const parentRef = useRef<HTMLDivElement | null>(null);

    const { mutate: updateUserALaCardPermission } = useUpdateUserALaCardPermission();

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        const roleFilter = selectedRole !== 'All' ? selectedRole : undefined;
        const permissionFilter = selectedPermission !== 'All' ? selectedPermission === 'true' : undefined;

        try {
            const res = await readUsers({
                path: { companyCode },
                query: {
                    pagination: { ...DEFAULT_OFFSET_PAGINATION_REQUEST, page },
                    filter: { role: roleFilter, aLaCardPermission: permissionFilter },
                },
            });

            if (res.results && res.results.length > 0) {
                setUsersData((prev) =>
                    page === 0 ? res.results : [...prev, ...res.results.filter((user) => !prev.some((u) => u.id === user.id))]
                );
                setHasMore(res.results.length >= DEFAULT_OFFSET_PAGINATION_REQUEST.size);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [selectedRole, selectedPermission, companyCode, page]);

    // Handle dynamic height calculation
    const calculateHeight = () => {
        if (parentRef.current) {
            const offset = 230;
            const height = window.innerHeight - offset;
            setListHeight(height);
        }
    };

    useEffect(() => {
        calculateHeight();
        window.addEventListener('resize', calculateHeight);
        return () => window.removeEventListener('resize', calculateHeight);
    }, []);

    // Refetch users when selectedRole, selectedPermission, or toggleRefresh changes
    useEffect(() => {
        setPage(0);
        setUsersData([]);
        setHasMore(true);
        setRefreshKey((prevKey) => prevKey + 1);
    }, [selectedRole, selectedPermission, toggleRefresh]);

    // Fetch users on page or refreshKey changes
    useEffect(() => {
        fetchUsers();
    }, [page, refreshKey, fetchUsers]);

    const handlePermissionChange = (userId: string, currentPermission: boolean) => {
        updateUserALaCardPermission(
            { path: { companyCode, userId }, body: { aLaCard: !currentPermission } },
            {
                onSuccess: (updatedUser) => {
                    setUsersData((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
                },
                onError: (error) => {
                    console.error('Failed to update user permission:', error);
                },
            }
        );
    };

    // Virtualized row renderer
    const Row = ({ index, style }: ListChildComponentProps) => {
        const user = usersData[index];
        return (
            <div
                key={user.id}
                style={style}
                className="flex cursor-pointer items-center justify-between border-b bg-white py-4 pr-8"
                onClick={() => onEditUser(user)}
            >
                <div className="flex flex-col">
                    <span className="text-lg font-semibold">{user.fullName}</span>
                    {user.role === 'Employee' && (
                        <span className="text-xs text-gray-700">
                            <strong>#{user.username}</strong> | Radnik
                        </span>
                    )}
                    {user.role === 'CompanyManager' && (
                        <span className="text-xs text-gray-700">
                            <strong>#{user.username}</strong> | Menadžer
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <CheckCircle2Icon
                        className={`cursor-pointer ${user.aLaCardPermission ? 'text-green-700' : 'text-gray-700'}`}
                        size={24}
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePermissionChange(user.id, user.aLaCardPermission);
                        }}
                    />
                    <span className="text-sm text-gray-700">A la carte</span>
                </div>
            </div>
        );
    };

    return (
        <div ref={parentRef} className="relative">
            <List
                className="overflow-y-auto"
                height={listHeight}
                itemCount={usersData.length}
                itemSize={80} // Adjust the size as needed
                width="100%"
                onItemsRendered={({ visibleStopIndex }) => {
                    // Load more users when scrolling to the bottom
                    if (visibleStopIndex === usersData.length - 1 && hasMore && !isLoading) {
                        setPage((prevPage) => prevPage + 1);
                    }
                }}
            >
                {Row}
            </List>
        </div>
    );
};
