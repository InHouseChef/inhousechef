import { useBaseUrl } from '@/hooks'
import Link from 'next/link'

export const MainNavLogo = () => {
    const { baseUrl } = useBaseUrl()
    // const { darkLogo: logo } = useBranding()

    return (
        <Link href={`${baseUrl}/dashboard`}>
            <span className='relative block h-[70px]'>
                Insert Logo Here
                {/* TODO: Add logo */}
                {/* {logo ? <Image fill src={logo} className='object-scale-down object-left-top' alt='logo' /> : <LogoLight />} */}
            </span>
        </Link>
    )
}
