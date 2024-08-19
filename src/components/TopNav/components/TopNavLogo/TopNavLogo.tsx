import { Logo } from '@/components/Logo'
import { useBaseUrl } from '@/hooks'
import Link from 'next/link'

export const TopNavLogo = () => {
    const { baseUrl } = useBaseUrl()

    return (
        <Link className='lg:hidden' href={`${baseUrl}/dashboard`}>
            <div className='relative h-[50px] w-52'>
                <Logo width={50} height={50} />
            </div>
        </Link>
    )
}
