'use client'

import { usePathParams } from '@/hooks'
import { UserUpdateProfileForm } from './components/UserUpdateProfileForm/UserUpdateProfileForm'
import { UserUpdateALaCardPermissionForm } from './components/UserUpdateALaCardPermissionForm/UserUpdateALaCardPermissionForm'

export default function CompanyUserPage() {
    const { companyCode, userId } = usePathParams<{ companyCode: string; userId: string }>()

    return (
        <>
            <div className='border-b border-gray-300 pb-4'>
                <UserUpdateProfileForm companyCode={companyCode} userId={userId} />
            </div>
            <div className='pb-4'>
                <UserUpdateALaCardPermissionForm companyCode={companyCode} userId={userId} />
            </div>
        </>
    )
}
