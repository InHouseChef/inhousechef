import { useLogout } from '@/hooks'

export const TopNavLogout = () => {
    const logout = useLogout()

    return (
        <button
            onClick={logout}
            className='hidden rounded bg-secondary/10 p-2.5 text-secondary transition-colors hover:bg-secondary hover:text-white lg:flex'>
            Logout
        </button>
    )
}
