import { ReadUserResponse } from "@/api/users";

export const UsersPage = ({users}: {users: ReadUserResponse[]}) => (
    <div className='mx-4 mt-4'>
        <table className='min-w-full border-collapse'>
            <thead>
                <tr>
                    <th className='border-b-2 border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                        Name
                    </th>
                    <th className='border-b-2 border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700'>
                        Username
                    </th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className='border-b border-gray-200 px-4 py-2 text-sm text-gray-700'>{user.fullName}</td>
                        <td className='border-b border-gray-200 px-4 py-2 text-sm text-gray-700'>{user.username}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)