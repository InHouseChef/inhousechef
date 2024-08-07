'use client'
import { MouseEvent, useState } from 'react'

export interface DialogEvents {
    onClose: VoidFunction
}

interface UseDialogControlProps extends DialogEvents {}

export const useDialogControl = (params?: UseDialogControlProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const callCallback = (callback?: VoidFunction | MouseEvent<HTMLButtonElement>) =>
        callback && typeof callback === 'function' && callback()

    const handleOpen = (callback?: VoidFunction | MouseEvent<HTMLButtonElement>) => {
        callCallback(callback)
        setIsOpen(true)
    }

    const handleClose = (callback?: VoidFunction | MouseEvent<HTMLButtonElement>) => {
        params?.onClose && params.onClose()
        callCallback(callback)
        setIsOpen(false)
    }

    return { isOpen, setIsOpen, handleOpen, handleClose }
}
