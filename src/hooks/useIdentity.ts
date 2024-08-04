import { Identity } from '@/api/identities'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { queryClient } from '@/lib/react-query'
import { AppJwt } from '@/types'
import { useQuery } from '@tanstack/react-query'
interface UseIdentityStore {
    identity?: Identity | null
    setIdentity: (identity?: Identity | null) => void
}

export const identityStore = create<UseIdentityStore>()(
    devtools(
        persist(
            set => ({
                identity: undefined,
                setIdentity: identity => {
                    set({ identity })
                    queryClient.invalidateQueries({ queryKey: ['identity'] })
                }
            }),

            {
                name: 'identity'
            }
        )
    )
)

export const useIdentity = () => {
    const { identity, setIdentity } = identityStore()

    const jwt = identity?.token ? jwtDecode<AppJwt>(identity.token) : undefined

    return { identity, setIdentity, jwt }
}

export const useReadIdentity = () => {
    return useQuery({
        queryKey: ['identity'],
        queryFn: () => identityStore.getState().identity || null
    })
}
