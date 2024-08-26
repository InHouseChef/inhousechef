import { create } from 'zustand'

interface CompanyState {
    companyCode: string | null
    companyId: string | null
    setCompany: (companyCode: string | null, companyId: string | null) => void
    getCompany: () => { companyCode: string | null; companyId: string | null }
}

export const useCompanyStore = create<CompanyState>(set => ({
    companyCode: null,
    companyId: null,
    setCompany: (companyCode, companyId) => set({ companyCode, companyId }),
    getCompany: () => {
        const { companyCode, companyId } = useCompanyStore.getState()
        return { companyCode, companyId }
    }
}))
