import { createRefreshToken } from '@/api/identities'
import { identityStore } from '@/hooks'
import { axiosPrivate } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const returnError = (error: Exception) => Promise.reject(error)
export const returnData = (response: AxiosResponse) => response.data

export const authorize = (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const passwordCredentials = identityStore.getState().identity

    if (request.headers && !request.headers.Authorization) {
        request.headers.Authorization = `Bearer ${passwordCredentials?.accessToken}`
    }

    return request
}

export const refreshToken = async (error: any) => {
    const config = error?.config
    const passwordCredentials = identityStore.getState().identity

    if (error?.response?.status === 401 && !config?._retry) {
        config._retry = true

        try {
            const refreshCredentials = await createRefreshToken({
                body: {
                    grantType: 'refresh_token',
                    refreshToken: passwordCredentials ? passwordCredentials.refreshToken : ''
                }
            })
            identityStore.setState({
                identity: { ...refreshCredentials, refreshToken: passwordCredentials?.refreshToken || '' }
            })
            queryClient.invalidateQueries({ queryKey: ['identity'] })
            config.headers.Authorization = `Bearer ${refreshCredentials.accessToken}`
            return axiosPrivate(config)
        } catch (error) {
            localStorage.clear()
            identityStore.setState({ identity: null })
        }
    }

    return Promise.reject(error.response.data)
}

export const formatError = (error: any) => {
    const errorClone = structuredClone(error)
    if (/^(5\d{2}|600)$/.test(error.status)) {
        errorClone.title = 'An unexpected error occurred.'
    }
    return Promise.reject(errorClone)
}
