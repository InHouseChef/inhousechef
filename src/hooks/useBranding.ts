import { useSettings } from '@/hooks/useSettings'

export const useBranding = () => {
    const { branding, isLoading } = useSettings()
    const lightLogo = branding?.logoUrl

    return {
        lightLogo,
        isLoading
    }
}
