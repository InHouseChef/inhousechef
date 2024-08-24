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
        label: 'Početna',
        path: 'pocetna'
    },
    {
        label: 'Moje porudžbine',
        path: 'moje-porudzbine'
    },
    {
        label: 'Istorija poručivanja',
        path: 'istorija-porucivanja'
    },
    {
        label: 'Korisnici',
        path: 'korisnici'
    }
]
