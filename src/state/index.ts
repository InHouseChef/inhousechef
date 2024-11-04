import { create, StoreApi, UseBoundStore } from 'zustand'

interface CompanyState {
    companyCode: string | null
    companyId: string | null
    setCompany: (companyCode: string | null | undefined, companyId: string | null | undefined) => void
    getCompany: () => { companyCode: string | null | undefined; companyId: string | null | undefined }
}

export const useCompanyStore: UseBoundStore<StoreApi<CompanyState>> = create<CompanyState>((set, get) => ({
    companyCode: null,
    companyId: null,
    setCompany: (companyCode, companyId) => set({ companyCode, companyId }),
    getCompany: () => {
        const { companyCode, companyId } = get()
        return { companyCode, companyId }
    }
}))
