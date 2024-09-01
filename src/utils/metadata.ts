import { readUserCompany } from '@/apis/companies'

export const getCompanyMetadataIcons = async () => {
    const userCompany = await readUserCompany()

    const lightFavicon = userCompany.branding?.logoUrl || '/images/favicon-light.svg'

    const darkFavicon = userCompany.branding?.logoUrl || '/images/favicon-dark.svg'

    return {
        icon: [
            {
                url: lightFavicon,
                media: '(prefers-color-scheme: light)',
                rel: 'icon',
                type: 'image/x-icon'
            },
            {
                url: darkFavicon,
                media: '(prefers-color-scheme: dark)',
                rel: 'icon',
                type: 'image/x-icon'
            }
        ]
    }
}
