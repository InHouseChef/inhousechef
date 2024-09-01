import { ReadUserResponse } from '@/apis/users'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { CreateUserForm } from '../CreateUserForm/CreateUserForm'
import { UpdateUserForm } from '../UpdateUserForm/UpdateUserForm'

export type UserPageUserDrawerProps = {
    companyCode: string
    isOpen: boolean
    onClose: () => void
    user: ReadUserResponse | null
    onSave: (userData?: ReadUserResponse) => void
}

export const UserPageUserDrawer = ({ companyCode, isOpen, onClose, user, onSave }: UserPageUserDrawerProps) => {
    const handleSaveUser = async () => {
        onSave()
        onClose()
    }

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent onPointerDownOutside={e => e.target === e.currentTarget && onClose()}>
                <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='text-left'>
                        <DrawerTitle className='mt-2 text-3xl font-bold'>
                            {user ? 'Izmeni korisnika' : 'Dodaj korisnika'}
                        </DrawerTitle>
                    </DrawerHeader>

                    {user ? (
                        <UpdateUserForm companyCode={companyCode} user={user} onSubmit={handleSaveUser} onClose={onClose} />
                    ) : (
                        <CreateUserForm companyCode={companyCode} onSubmit={handleSaveUser} onClose={onClose} />
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
