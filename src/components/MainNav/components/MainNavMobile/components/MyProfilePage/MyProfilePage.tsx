import { Building, Building2Icon, HashIcon, UserIcon } from 'lucide-react';
import clsx from 'clsx';
import { ReadUserResponse, RolesEnum } from '@/api/users';
import { UserProfileIcon } from '../../icons';

export const MyProfilePage = ({ user }: { user: ReadUserResponse}) => {
    return (
        <div className="max-w-lg mx-auto mt-8">
            {/* User Profile Icon */}
            <div className="flex justify-center mb-4">
                <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-3xl text-white font-semibold">
                        {user.fullName.split(' ').map((name, index) => index < 2 ? name.charAt(0) : '').join(' ')}
                    </span>
                </div>
            </div>

            {/* User Name */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold">{user.fullName}</h1>
            </div>

            {/* User Info List */}
            <ul>
                <li
                    className={clsx(
                        "flex items-center bg-gray-100 py-6 px-4 gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-t-lg"
                    )}
                    key={'fullName'}
                >
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full">
                        {/* User Icon */}
                        <UserIcon className="h-6 w-6" color='#7c3aed' />
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                        {user.fullName}
                    </span>
                </li>
                <li
                    className={clsx(
                        "flex items-center bg-gray-100 py-6 px-4 gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-b-lg"
                    )}
                    key={'username'}
                >
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full">
                        {/* Username Icon */}
                        <HashIcon className="h-6 w-6" color='#7c3aed' />
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                        {user.username}
                    </span>
                </li>
                <li
                    className={clsx(
                        "flex items-center bg-gray-100 py-6 px-4 gap-4 border-b last:border-b-0 hover:bg-gray-200 cursor-pointer transition-all rounded-b-lg"
                    )}
                    key={'username'}
                >
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full">
                        {/* Username Icon */}
                        <Building className="h-6 w-6" color='#7c3aed' />
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                        {user.role === RolesEnum.Employee && 'Radnik'}
                        {user.role === RolesEnum.CompanyManager && 'Menadžer'}
                    </span>
                </li>
            </ul>
        </div>
    );
}
