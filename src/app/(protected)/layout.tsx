'use client'

import { useRoles } from '@/providers/RoleProvider/RoleProvider'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import { ClientProtectedLayout } from './layouts/ProtectedLayout'
import { TopNav } from '@/components'

interface ProtectedLayoutProps {
    children?: ReactNode
}

// export async function generateMetadata(): Promise<Metadata> {
//     const title = 'Kristal Kettering'
//     const description = 'Kristal Kettering'

//     return {
//         title,
//         description,
//         icons: {
//             icon: [
//                 {
//                     url: '/images/favicon-light.svg',
//                     media: '(prefers-color-scheme: light)',
//                     rel: 'icon',
//                     type: 'image/x-icon'
//                 },
//                 {
//                     url: '/images/favicon-dark.svg',
//                     media: '(prefers-color-scheme: dark)',
//                     rel: 'icon',
//                     type: 'image/x-icon'
//                 }
//             ]
//         }
//     }
// }

export default function Layout({ children }: ProtectedLayoutProps) {
    const { roles } = useRoles()

    if (roles.Employee === true || roles.CompanyManager === true) {
        return (
            <ClientProtectedLayout>
                <div className='flex flex-grow flex-col overflow-x-clip'>
                    <TopNav />
                    {children}
                </div>
            </ClientProtectedLayout>
        )
    }

    return <>{children}</>
}
