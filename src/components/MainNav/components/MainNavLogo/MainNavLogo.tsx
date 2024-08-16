import { Logo } from '@/components/Logo'
import { useBaseUrl } from '@/hooks'
import Link from 'next/link'

export const MainNavLogo = () => {
    const { baseUrl } = useBaseUrl()

    return (
        <Link href={`${baseUrl}/dashboard`}>
            <span className='relative block h-[70px]'>
                <Logo width={70} height={70} />
            </span>
        </Link>
    )
}
