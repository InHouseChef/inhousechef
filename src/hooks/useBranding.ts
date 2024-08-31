import { useSettings } from '@/hooks/useSettings'

export const useBranding = () => {
    const { branding, isLoading } = useSettings()
    const lightLogo = branding?.logoUrl
    // TODO: support favicon at some point
    const lightFavicon = branding?.logoUrl

    return {
        lightLogo,
        lightFavicon,
        isLoading
    }
}
