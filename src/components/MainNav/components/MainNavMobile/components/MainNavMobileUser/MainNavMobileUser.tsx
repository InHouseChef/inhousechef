import { useBaseUrl } from '@/hooks'
import Link from 'next/link'

export const MainNavMobileUser = () => {
    const { baseUrl } = useBaseUrl()

    // const { data } = useReadUserProfile()

    // const fullName = getFullName({
    //     firstName: data?.firstName,
    //     lastName: data?.lastName
    // })

    const fullName = 'Admin Adminovic'

    return (
        <div className='flex items-center gap-4'>
            <div className='rounded-full border border-secondary p-[3px]'>
                <div className='overflow-hidden rounded-full'>
                    <Link href={`${baseUrl}/account`}>
                        {/* TODO: Add Avatar */}
                        {/* <Avatar image={data?.profileImageUrl} size={48} letters={fullName} /> */}
                    </Link>
                </div>
            </div>
            <div className='flex flex-col'>
                <span className='text-grey text-xs'>Welcome back</span>
                <span className='text-2xl font-bold'>{fullName}</span>
            </div>
        </div>
    )
}
