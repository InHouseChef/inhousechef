import { ReactNode } from 'react'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <>
            {children}
        </>
    )
}
