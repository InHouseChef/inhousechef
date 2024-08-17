import { ReactNode } from 'react'

interface ClientCompanyLayoutProps {
    children?: ReactNode
}

export default function ClientCompanyLayout({ children }: ClientCompanyLayoutProps) {
    return <>{children}</>
}
