import { Branding } from '@/types'

export interface Company {
    name: string
    code: string
    branding?: Branding
    address?: {
        street?: string
        city?: string
    }
    telephone?: string
}

export interface ReadCompanyResponse extends Company {
    id: string
}

export interface CreateCompanyRequest extends Omit<Company, 'branding'> {}
export interface CreateCompanyResponse extends Company {
    id: string
}

export interface UpdateCompanyDetailsRequest {
    name: string
    code: string
    address?: {
        street?: string
        city?: string
    }
    telephone?: string
}

export interface UpdateCompanyBrandingColorsRequest {
    primaryColor?: string
    secondaryColor?: string
}

export interface UpdateCompanyBrandingLogoRequest {
    logo: File
}

export interface UpdateCompanyResponse extends Company {
    id: string
}

export interface ReadUserCompanyResponse {
    companyId: string
    companyCode: string
}
