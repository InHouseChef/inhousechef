import { UsersIcon } from 'lucide-react'
import { MenuIcon, UserProfileIcon, UserGroupIcon } from '../components/MainNavMobile/MainNavMobile'
import { MainNavLink } from '../types'

export const LINKS: MainNavLink[] = [
    {
        label: 'Dashboard',
        path: 'admin/dashboard'
    },
    {
        label: 'Companies',
        path: 'admin/companies'
    },
    {
        label: 'Daily Menus',
        path: 'admin/daily-menus'
    },
    {
        label: 'A La Card Menus',
        path: 'admin/alacard-menus'
    },
    {
        label: 'Meals',
        path: 'admin/meals'
    }
]

