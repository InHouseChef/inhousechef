import axios from 'axios'
import { authorize, formatError, refreshToken, returnData, returnError } from './interceptors'

const DEFAULT_AXIOS_CONFIG_HEADERS = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true
}

// Public
export const axiosPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GATEWAY_BASE_URL,
    headers: DEFAULT_AXIOS_CONFIG_HEADERS
})

axiosPublic.interceptors.response.use(returnData, error => Promise.reject(error.response.data))

// Protected
export const axiosPrivate = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GATEWAY_BASE_URL,
    headers: DEFAULT_AXIOS_CONFIG_HEADERS
})

axiosPrivate.interceptors.request.use(authorize, returnError)
axiosPrivate.interceptors.response.use(returnData, refreshToken)
axiosPrivate.interceptors.response.use(undefined, formatError)
