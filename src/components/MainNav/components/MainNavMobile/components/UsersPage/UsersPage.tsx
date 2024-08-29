'use client'

import { RolesEnum } from '@/api/users'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { UserPageTable } from './UserPageTable/UserPageTable'

export const UsersPage = () => {
    const { companyCode } = useParams()

    const [selectedRole, setSelectedRole] = useState<string>('All')
    const [selectedPermission, setSelectedPermission] = useState<string>('All')

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
                        <SelectItem value='true'>Ima a la carte permisiju</SelectItem>
                        <SelectItem value='false'>Nema a la carte permisiju</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant='outline' className='w-full' size={'sm'} onClick={handleResetFilters}>
                    Reset
                </Button>
            </div>

            <UserPageTable 
                companyCode={companyCode} 
                selectedRole={selectedRole} 
                selectedPermission={selectedPermission} 
            />

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white drop-shadow-lg">
                <Button className="w-full" variant="default">
                    Dodaj novog korisnika
                </Button>
            </div>
        </div>
    )
}
