export interface Company {
    name?: string
    branding: {
        primaryColor: string
        secondaryColor: string
        logoUrl?: string
    }
    address: {
        street: string
        city: string
    }
    telephone?: string
}

export interface ReadCompanyResponse extends Company {
    id: string
}

export interface CreateCompanyRequest extends Company {}
export interface CreateCompanyResponse extends Company {
    id: string
}

export interface UpdateCompanyRequest extends Company {}
export interface UpdateCompanyResponse extends Company {
    id: string
}
