import { Logo } from '@/components/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { useBaseUrl, useBranding, usePathParams } from '@/hooks'
import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { CompanyPath } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export const TopNavLogo = () => {
    const { companyCode } = usePathParams<CompanyPath>()
    const { adminUrl, employeeUrl } = useBaseUrl()

    const { roles } = useRoles()

    const { lightLogo: logo, isLoading } = useBranding()

    if (isLoading) return <Skeleton className='h-[50px] w-52' />

    const isAdmin = roles.Admin
    const baseUrl = isAdmin ? adminUrl : employeeUrl
    const companyPath = isAdmin ? '' : companyCode

    return (
        <Link href={`${baseUrl}/companies/${companyPath}`}>
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
