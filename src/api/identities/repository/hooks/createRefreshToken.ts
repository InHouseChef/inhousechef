import { axiosPublic } from '@/lib/axios'
import { CreateLoginResponse, LoginRefreshTokenRequest } from '../..'

interface CreateRefreshTokenParams {
    body: LoginRefreshTokenRequest
}

export const createRefreshToken = ({ body }: CreateRefreshTokenParams): Promise<CreateLoginResponse> =>
    axiosPublic.post('/login', body)
