import { useBaseUrl } from '@/hooks'
import clsx from 'clsx'
import Link from 'next/link'

interface TopNavUserProps {
    isNavOpen: boolean
}

export const TopNavUser = ({ isNavOpen }: TopNavUserProps) => {
    const { baseUrl } = useBaseUrl()

    // const { data } = useReadUserProfile()

    // const fullName = getFullName({
    //     firstName: data?.firstName,
    //     lastName: data?.lastName
    // })

    const fullName = 'Admin Adminovic'

    return (
        <div
            className={clsx('flex translate-x-0 items-center gap-4 transition-transform duration-300', {
                'translate-x-20 lg:translate-x-0': isNavOpen
            })}>
            <div className='hidden flex-col text-right lg:flex'>
                <span className='text-xs text-grey'>Welcome back</span>
                <span className='text-base font-bold'>{fullName}</span>
            </div>
            <div className='rounded-full border border-secondary p-[3px]'>
                <div className='overflow-hidden rounded-full'>
                    <Link href={`${baseUrl}/account`}>
                        {/* <Avatar
                            image={data?.profileImageUrl}
                            size={48}
                            letters={fullName}
                            className='h-10 w-10 cursor-pointer lg:h-12 lg:w-12'
                        /> */}
                    </Link>
                </div>
            </div>
        </div>
    )
}
