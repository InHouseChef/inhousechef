import { ClientProtectedLayout } from "../layouts/ProtectedLayout"
import { ReactNode } from "react"

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <ClientProtectedLayout>
            {children}
        </ClientProtectedLayout>
    )
}