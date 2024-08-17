export interface Company {
    name: string
    code: string
    branding?: {
        primaryColor?: string
        secondaryColor?: string
        logoUrl?: string
    }
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

export interface UpdateCompanyRequest {
    company: Omit<Company, 'branding'> & {
        branding: {
            primaryColor?: number
            secondaryColor?: number
            logo: File
        }
    }
}
export interface UpdateCompanyResponse extends Company {
    id: string
}
