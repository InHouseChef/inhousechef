import { ReadUserResponse, useUpdateUserALaCardPermission } from '@/api/users'
import { readUsers } from '@/api/users/repository/hooks/readUsers'
import { Loader } from '@/components'
import { DEFAULT_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { CheckCircle2Icon } from 'lucide-react'
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

export type UserPageTableProps = {
    toggleRefresh: boolean
    companyCode: string
    selectedRole: string
    selectedPermission: string
    onEditUser: (user: ReadUserResponse) => void
}

export const UserPageTable = ({
    toggleRefresh,
    companyCode,
    selectedRole,
    selectedPermission,
    onEditUser
}: UserPageTableProps) => {
    const [usersData, setUsersData] = useState<ReadUserResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [listHeight, setListHeight] = useState(0)
    const parentRef = useRef(null)

    const { mutate: updateUserALaCardPermission } = useUpdateUserALaCardPermission()

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        const roleFilter = selectedRole !== 'All' ? selectedRole : undefined
        const permissionFilter = selectedPermission !== 'All' ? selectedPermission === 'true' : undefined

        try {
            const res = await readUsers({
                path: { companyCode },
                query: {
                    pagination: { ...DEFAULT_OFFSET_PAGINATION_REQUEST, page },
                    filter: { role: roleFilter, aLaCardPermission: permissionFilter }
                }
            })

            if (res.results && res.results.length > 0) {
                setUsersData(prev =>
                    page === 0
                        ? res.results
                        : [
                              ...prev,
                              ...res.results.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
                          ]
                )
                setHasMore(res.results.length >= DEFAULT_OFFSET_PAGINATION_REQUEST.size)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [selectedRole, selectedPermission, companyCode, page])

    useEffect(() => {
        setPage(0)
        setUsersData([])
        setHasMore(true)
    }, [selectedRole, selectedPermission, toggleRefresh])

    useEffect(() => {
        fetchUsers()
    }, [page, fetchUsers])

    useEffect(() => {
        const calculateHeight = () => {
            if (parentRef.current) {
                const offset = 230
                const height = window.innerHeight - offset
                setListHeight(height)
            }
        }

        calculateHeight()
        window.addEventListener('resize', calculateHeight)

        return () => window.removeEventListener('resize', calculateHeight)
    }, [parentRef])

    const loadMoreItems = useCallback(() => {
        if (hasMore && !isLoading) {
            setPage(prevPage => prevPage + 1)
        }
    }, [hasMore, isLoading])

    const isItemLoaded = (index: number) => !hasMore || index < usersData.length

    const handlePermissionChange = (userId: string, currentPermission: boolean) => {
        updateUserALaCardPermission(
            { path: { companyCode, userId }, body: { aLaCard: !currentPermission } },
            {
                onSuccess: updatedUser => {
                    setUsersData(prevUsers => prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user)))
                },
                onError: error => {
                    console.error('Failed to update user permission:', error)
                }
            }
        )
    }

    const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
        const user = usersData[index]
        if (!user) {
            return (
                <div style={style} className='flex items-center justify-center py-4'>
                    <Loader />
                </div>
            )
        }

        return (
            <div
                style={style}
                key={user.id}
                className='flex cursor-pointer items-center justify-between border-b bg-white py-4 pr-8'
                onClick={() => onEditUser(user)} // Handle click to edit the user
            >
                <div className='flex flex-col'>
                    <span className='text-lg font-semibold'>{user.fullName}</span>
                    {user.role === 'Employee' && <span className='text-sm text-gray-500'>Radnik</span>}
                    {user.role === 'CompanyManager' && <span className='text-sm text-gray-500'>Menadžer</span>}
                </div>
                <CheckCircle2Icon
                    className={`cursor-pointer ${user.aLaCardPermission ? 'text-green-500' : 'text-gray-500'}`}
                    size={24}
                    onClick={e => {
                        e.stopPropagation() // Prevent triggering the row click event
                        handlePermissionChange(user.id, user.aLaCardPermission)
                    }}
                />
            </div>
        )
    }

    return (
        <div ref={parentRef} className='relative' style={{ height: `${listHeight}px`, marginBottom: '50px' }}>
            <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={hasMore ? usersData.length + 1 : usersData.length}
                loadMoreItems={loadMoreItems}>
                {({ onItemsRendered, ref }: { onItemsRendered: any; ref: any }) => (
                    <List
                        height={listHeight}
                        itemCount={usersData.length}
                        itemSize={70}
                        width={'100%'}
                        onItemsRendered={onItemsRendered}
                        ref={ref}>
                        {Row}
                    </List>
                )}
            </InfiniteLoader>
        </div>
    )
}
