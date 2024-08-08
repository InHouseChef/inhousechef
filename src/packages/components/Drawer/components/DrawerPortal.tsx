import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

interface DrawerPortalProps {
    usePortal?: boolean
    children: ReactNode
}

export const DrawerPortal = ({ usePortal, children }: DrawerPortalProps) =>
    usePortal ? <Dialog.Portal>{children}</Dialog.Portal> : children
