import { ReadUserResponse, RolesEnum } from '@/api/users'
import clsx from 'clsx'
import { Building, HashIcon, UserIcon } from 'lucide-react'

export const MyProfilePage = ({ user }: { user?: ReadUserResponse }) => {
    return (
        <div className='mx-auto mt-8 max-w-lg'>
            {/* User Profile Icon */}
            <div className='mb-4 flex justify-center'>
                <div className='flex h-24 w-24 items-center justify-center rounded-full bg-primary'>
                    <span className='text-3xl font-semibold text-white'>
                        {user?.fullName
                            .split(' ')
                            .map((name, index) => (index < 2 ? name.charAt(0) : ''))
                            .join(' ')}
                    </span>
                </div>
            </div>

            {/* User Name */}
            <div className='mb-8 text-center'>
                <h1 className='text-2xl font-semibold'>{user?.fullName}</h1>
            </div>

            {/* User Info List */}
            <ul>
                <li
                    className={clsx(
                        'flex cursor-pointer items-center gap-4 rounded-t-lg border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200'
                    )}
                    key={'fullName'}>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                        {/* User Icon */}
                        <UserIcon className='h-6 w-6' color='#7c3aed' />
                    </div>
                    <span className='text-lg font-medium text-gray-700'>{user?.fullName}</span>
                </li>
                <li
                    className={clsx(
                        'flex cursor-pointer items-center gap-4 border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200'
                    )}
                    key={'username'}>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                        {/* Username Icon */}
                        <HashIcon className='h-6 w-6' color='#7c3aed' />
                    </div>
                    <span className='text-lg font-medium text-gray-700'>{user?.username}</span>
                </li>
                <li
                    className={clsx(
                        'flex cursor-pointer items-center gap-4 border-b bg-gray-100 px-4 py-6 transition-all last:border-b-0 hover:bg-gray-200'
                    )}
                    key={'username'}>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                        {/* Username Icon */}
                        <Building className='h-6 w-6' color='#7c3aed' />
                    </div>
                    <span className='text-lg font-medium text-gray-700'>
                        {user?.role === RolesEnum.Employee && 'Radnik'}
                        {user?.role === RolesEnum.CompanyManager && 'Menadžer'}
                    </span>
                </li>
            </ul>
        </div>
    )
}
