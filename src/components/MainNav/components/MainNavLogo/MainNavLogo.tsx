import { Logo } from '@/components/Logo'
import { useBaseUrl } from '@/hooks'
import Link from 'next/link'

export const MainNavLogo = () => {
    const { baseUrl } = useBaseUrl()

    return (
        <Link href={`${baseUrl}/dashboard`}>
            <div className='relative h-[50px] w-[50px]'>
                <Logo width={50} height={50} className='text-white rounded-full object-cover' />
            </div>
        </Link>
    )
}
