'use client'

import { ReadUserResponse, RolesEnum, useUpdateUserALaCardPermission } from '@/api/users'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { UserPageTable } from './UserPageTable/UserPageTable'
import { UserPageUserDrawer } from './UserPageUserDrawer/UserPageUserDrawer'
import { usePathParams } from '@/hooks'

export const UsersPage = () => {
    const { companyCode } = usePathParams<{ companyCode: string }>()

    const [selectedRole, setSelectedRole] = useState<string>('All')
    const [selectedPermission, setSelectedPermission] = useState<string>('All')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<ReadUserResponse|null>(null)
    const [tableRefreshToggle, setTableRefreshToggle] = useState(false)

    const { mutate: updateUserALaCardPermission } = useUpdateUserALaCardPermission()

    const handleResetFilters = () => {
        setSelectedRole('All')
        setSelectedPermission('All')
    }

    const handleRoleChange = (role: string) => {
        setSelectedRole(role)
    }

    const handlePermissionChange = (permission: string) => {
        setSelectedPermission(permission)
    }

    const handleStartNewUserForm = () => {
        setSelectedUser(null) // No user selected, indicating a new user will be added
        setIsDrawerOpen(true)
    }

    const handleStartEditUserForm = (user: ReadUserResponse) => {
        setSelectedUser(user)
        setIsDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
        setSelectedUser(null)
    }

    const submitSaveUser = () => {
        setIsDrawerOpen(false)
        setSelectedUser(null)
        setTableRefreshToggle(!tableRefreshToggle)
    }

    return (
        <div className='relative h-full'>
            <div className='position-sticky sticky-0 flex items-center gap-2 pb-2'>
                <Select onValueChange={handleRoleChange} value={selectedRole} >
                    <SelectTrigger>
                        <SelectValue placeholder='Filter by role' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>Pozicija</SelectItem>
                        <SelectItem value={RolesEnum.CompanyManager}>Menadžer</SelectItem>
                        <SelectItem value={RolesEnum.Employee}>Radnik</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={handlePermissionChange} value={selectedPermission} >
                    <SelectTrigger>
                        <SelectValue placeholder='Filter by A La Card Permission' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='All'>A la carte</SelectItem>
                        <SelectItem value='true'>Ima a la carte dozvolu</SelectItem>
                        <SelectItem value='false'>Nema a la carte dozvolu</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant='outline' className='w-full' size={'sm'} onClick={handleResetFilters}>
                    Poništi
                </Button>
            </div>

            <UserPageTable 
                toggleRefresh={tableRefreshToggle}
                companyCode={companyCode} 
                selectedRole={selectedRole} 
                selectedPermission={selectedPermission} 
                onEditUser={handleStartEditUserForm} // Pass the edit handler
            />

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white drop-shadow-lg">
                <Button className="w-full" variant="default" onClick={handleStartNewUserForm}>
                    Dodaj novog korisnika
                </Button>
            </div>

            <UserPageUserDrawer 
                companyCode={companyCode}
                isOpen={isDrawerOpen} 
                user={selectedUser} 
                key={selectedUser?.id} 
                onSave={submitSaveUser}
                onClose={handleDrawerClose} />
        </div>
    )
}
