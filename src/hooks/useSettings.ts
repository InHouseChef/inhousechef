'use client'
import { useReadUserCompany } from '@/api/companies'
import { Branding, CompanyPath } from '@/types'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface useSettingsStore {
    branding?: Branding | null
    setBranding: (branding: Branding | null) => void
}

export const settingsStore = create<useSettingsStore>()(
    devtools(
        persist(
            set => ({
                branding: undefined,
                setBranding: branding => set({ branding })
            }),
            {
                name: 'settings'
            }
        )
    )
)

export const useSettings = () => {
    const { companyCode } = useParams<CompanyPath>()

    const {
        data: companyUserResponse,
        isLoading: isLoadingCompanyUserResponse,
        isError: isErrorCompanyUserResponse,
        isFetched: isFetchedCompanyUserResponse
    } = useReadUserCompany()

    const { branding, setBranding } = settingsStore()

    useEffect(() => {
        if (companyUserResponse) setBranding(companyUserResponse?.branding ?? null)
    }, [companyUserResponse])

    useEffect(() => {
        if (companyUserResponse && companyUserResponse.branding) setBranding(companyUserResponse.branding)
    }, [companyUserResponse])

    useEffect(() => {
        if (!companyCode) {
            setBranding(null)
        }
    }, [companyCode])

    return {
        branding,
        isLoading: isLoadingCompanyUserResponse,
        isFetched: isFetchedCompanyUserResponse,
        isError: isErrorCompanyUserResponse
    }
}
