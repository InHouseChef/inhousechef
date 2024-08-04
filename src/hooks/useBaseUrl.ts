'use client'

export const useBaseUrl = () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`

    return { baseUrl }
}
