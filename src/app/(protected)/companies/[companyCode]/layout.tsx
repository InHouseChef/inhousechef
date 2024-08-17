import { ReactNode } from 'react'
import CompanyLayout from './(admin)/layouts/CompanyLayout'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    // TODO: return different layout based on role

    return <CompanyLayout>{children}</CompanyLayout>
}
