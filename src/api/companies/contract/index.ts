export interface Company {
    id: string
    name: string
    subdomain: string
    branding: string
    address: string
    telephone: string
}

export interface ReadCompanyResponse extends Company {}

export interface CreateCompanyRequest extends Company {}
export interface CreateCompanyResponse extends Company {
    id: string
}

export interface UpdateCompanyRequest extends Company {}
export interface UpdateCompanyResponse extends Company {
    id: string
}
