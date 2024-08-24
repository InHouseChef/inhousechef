import { create } from 'zustand'

interface CompanyState {
    companyCode: string | null
    companyId: string | null
    setCompany: (companyCode: string, companyId: string) => void
}

export const useCompanyStore = create<CompanyState>(set => ({
    companyCode: null,
    companyId: null,
    setCompany: (companyCode, companyId) => set({ companyCode, companyId })
}))
