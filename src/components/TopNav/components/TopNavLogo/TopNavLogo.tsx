import { Loader } from '@/components/Loader'
import { Logo } from '@/components/Logo'
import { useBaseUrl, useBranding, usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export const TopNavLogo = () => {
    const { companyCode } = usePathParams<CompanyPath>()
    const { baseUrl } = useBaseUrl()

    const { lightLogo: logo, isLoading } = useBranding()
    if (isLoading) return <Loader />

    return (
        <Link className='lg:hidden' href={`${baseUrl}/companies/${companyCode}`}>
            <div className='relative h-[50px] w-52'>
                {logo ? (
                    <Image fill src={logo} className='object-scale-down object-[left_center]' alt='logo' />
                ) : (
                    <Logo width={50} height={50} className='text-[#3B1A44]' />
                )}
            </div>
        </Link>
    )
}
