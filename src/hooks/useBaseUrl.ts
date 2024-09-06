'use client'

export const useBaseUrl = () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`
    const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin`
    const employeeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`

    return { baseUrl, adminUrl, employeeUrl }
}
