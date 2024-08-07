import { Logo } from '@/components'
import { useBaseUrl } from '@/hooks'
import Link from 'next/link'

export const TopNavLogo = () => {
    const { baseUrl } = useBaseUrl()

    return (
        <Link className='lg:hidden' href={`${baseUrl}/dashboard`}>
            <div className='relative h-[50px] w-52'>
                <Logo />
            </div>
        </Link>
    )
}
