import { createContext, ReactNode, useContext } from 'react'

export function createSafeContext<T>() {
    const Context = createContext<T | null>(null)

    const useSafeContext = () => {
        const ctx = useContext(Context)

        if (ctx === null) {
            throw new Error()
        }

        return ctx
    }

    const Provider = ({ children, value }: { value: T; children?: ReactNode }) => (
        <Context.Provider value={value}>{children}</Context.Provider>
    )

    return [Provider, useSafeContext] as const
}
