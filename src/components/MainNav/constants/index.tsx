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

export const CLIENT_COMPANY_LINKS: MainNavLink[] = [
    {
        label: 'Moje porudžbine',
        path: 'my-orders'
    },
    {
        label: 'Istorija poručivanja',
        path: 'order-history'
    },
    {
        label: 'Jelovnik',
        path: 'menu'
    },
    {
        label: 'Korisnici',
        path: 'users'
    }
]
