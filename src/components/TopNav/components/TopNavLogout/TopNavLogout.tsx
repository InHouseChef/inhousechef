import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks'

export const TopNavLogout = () => {
    const logout = useLogout()

    return (
        <Button onClick={logout} variant='outline' className='hidden lg:flex'>
            Logout
        </Button>
    )
}
